import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Confidentiality, DocumentStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { StorageService } from './storage.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';
import { JwtPayload } from '../auth/decorators/current-user.decorator';

const ADMIN_ROLES: Role[] = [Role.ADMINISTRATEUR, Role.SUPERVISEUR];

@Injectable()
export class DocumentsService {
  private readonly allowedMimeTypes: string[];

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly activity: ActivityService,
    config: ConfigService,
  ) {
    this.allowedMimeTypes = config.get<string[]>('upload.allowedMimeTypes') ?? [];
  }

  // ─── Lecture ──────────────────────────────────────────────────────────────

  async findAll(query: QueryDocumentsDto, actor: JwtPayload) {
    const { q, categoryId, confidentiality, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    // Visiteurs non authentifiés : uniquement les documents publics actifs
    const isStaff = actor && ADMIN_ROLES.includes(actor.role);
    const confFilter = isStaff
      ? confidentiality
      : (confidentiality ?? Confidentiality.PUBLIC);

    const where = {
      status: status ?? DocumentStatus.ACTIVE,
      ...(confFilter ? { confidentiality: confFilter } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' as const } },
              { description: { contains: q, mode: 'insensitive' as const } },
              { tags: { has: q } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          uploadedBy: { select: { id: true, fullName: true } },
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string, actor: JwtPayload) {
    const doc = await this.prisma.document.findUnique({
      where: { id, status: { not: DocumentStatus.DELETED } },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        uploadedBy: { select: { id: true, fullName: true } },
      },
    });
    if (!doc) throw new NotFoundException('Document introuvable.');
    this.assertAccess(doc.confidentiality, actor);

    if (actor) {
      await this.activity.log({ userId: actor.sub, action: 'DOCUMENT_VIEW', resourceType: 'document', resourceId: id });
    }
    return doc;
  }

  async getDownloadUrl(id: string, actor: JwtPayload) {
    const doc = await this.findOne(id, actor);
    const url = await this.storage.getSignedUrl(doc.fileKey);
    if (actor) {
      await this.activity.log({ userId: actor.sub, action: 'DOCUMENT_DOWNLOAD', resourceType: 'document', resourceId: id });
    }
    return { url, fileName: doc.fileName, mimeType: doc.fileMimeType };
  }

  // ─── Upload ───────────────────────────────────────────────────────────────

  async upload(file: Express.Multer.File, dto: CreateDocumentDto, actor: JwtPayload) {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Type de fichier non autorisé : ${file.mimetype}`);
    }

    const cat = await this.prisma.documentCategory.findUnique({ where: { id: dto.categoryId } });
    if (!cat) throw new NotFoundException('Catégorie introuvable.');

    const stored = await this.storage.upload(file, `documents/${cat.slug}`);

    const doc = await this.prisma.document.create({
      data: {
        title: dto.title,
        description: dto.description,
        categoryId: dto.categoryId,
        confidentiality: dto.confidentiality ?? cat.defaultConfidentiality,
        tags: dto.tags ?? [],
        uploadedById: actor.sub,
        ...stored,
        // Les agents/lecteurs soumettent en attente de validation
        status: ADMIN_ROLES.includes(actor.role) ? DocumentStatus.ACTIVE : DocumentStatus.ARCHIVED,
      },
      include: {
        category: { select: { id: true, name: true } },
        uploadedBy: { select: { id: true, fullName: true } },
      },
    });

    await this.activity.log({ userId: actor.sub, action: 'DOCUMENT_UPLOAD', resourceType: 'document', resourceId: doc.id });
    return doc;
  }

  // ─── Mise à jour ──────────────────────────────────────────────────────────

  async update(id: string, dto: Partial<CreateDocumentDto & { status: DocumentStatus }>, actor: JwtPayload) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document introuvable.');

    const isOwner = doc.uploadedById === actor.sub;
    const isStaff = ADMIN_ROLES.includes(actor.role);

    if (!isOwner && !isStaff) throw new ForbiddenException('Action non autorisée.');
    if (dto.status && !isStaff) throw new ForbiddenException('Seul un admin peut modifier le statut.');

    const updated = await this.prisma.document.update({ where: { id }, data: dto });
    await this.activity.log({ userId: actor.sub, action: 'DOCUMENT_UPDATE', resourceType: 'document', resourceId: id });
    return updated;
  }

  // ─── Suppression ──────────────────────────────────────────────────────────

  async remove(id: string, actor: JwtPayload) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document introuvable.');

    const isOwner = doc.uploadedById === actor.sub;
    const isAdmin = actor.role === Role.ADMINISTRATEUR;

    if (!isOwner && !isAdmin) throw new ForbiddenException('Action non autorisée.');

    // Soft delete
    await this.prisma.document.update({
      where: { id },
      data: { status: DocumentStatus.DELETED, deletedAt: new Date() },
    });

    // Supprimer le fichier du stockage (non bloquant)
    this.storage.delete(doc.fileKey).catch(() => null);

    await this.activity.log({ userId: actor.sub, action: 'DOCUMENT_DELETE', resourceType: 'document', resourceId: id });
  }

  // ─── Validation admin ─────────────────────────────────────────────────────

  async approve(id: string, actor: JwtPayload) {
    return this.update(id, { status: DocumentStatus.ACTIVE }, actor);
  }

  async reject(id: string, actor: JwtPayload) {
    return this.update(id, { status: DocumentStatus.ARCHIVED }, actor);
  }

  // ─── Privé ────────────────────────────────────────────────────────────────

  private assertAccess(confidentiality: Confidentiality, actor: JwtPayload | null) {
    if (confidentiality === Confidentiality.PUBLIC) return;
    if (!actor) throw new ForbiddenException('Connexion requise pour accéder à ce document.');
    if (confidentiality === Confidentiality.CONFIDENTIEL && !ADMIN_ROLES.includes(actor.role)) {
      throw new ForbiddenException('Accès réservé aux administrateurs.');
    }
  }
}
