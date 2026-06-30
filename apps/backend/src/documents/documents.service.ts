import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Confidentiality, DocumentStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { StorageService } from './storage.service';
import { MailService } from '../mail/mail.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';
import { JwtPayload } from '../auth/decorators/current-user.decorator';

const ADMIN_ROLES: Role[] = [Role.ADMINISTRATEUR, Role.SUPERVISEUR];
// CDC §5.4-5.5 : CONSULTANT et LECTEUR ne voient que PUBLIC + ce qui leur est explicitement accordé
const RESTRICTED_ROLES: Role[] = [Role.CONSULTANT, Role.LECTEUR];

@Injectable()
export class DocumentsService {
  private readonly allowedMimeTypes: string[];

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly activity: ActivityService,
    private readonly mail: MailService,
    config: ConfigService,
  ) {
    this.allowedMimeTypes = config.get<string[]>('upload.allowedMimeTypes') ?? [];
  }

  // ─── Lecture ──────────────────────────────────────────────────────────────

  async findAll(query: QueryDocumentsDto, actor: JwtPayload) {
    const { q, categoryId, confidentiality, status, uploadedById, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const isStaff = actor && ADMIN_ROLES.includes(actor.role);
    const isRestricted = actor && RESTRICTED_ROLES.includes(actor.role);

    // Admin sans filtre de statut → tout sauf DELETED ; visiteur → ACTIVE uniquement
    const statusWhere = status
      ? { status }
      : isStaff
        ? { status: { not: DocumentStatus.DELETED } }
        : { status: DocumentStatus.ACTIVE };

    // Filtre confidentialité selon le niveau d'accès :
    //   admin/superviseur     → aucun filtre (voit tout) ou filtre explicite
    //   consultant/lecteur    → PUBLIC + accès explicitement accordés (CDC §5.4-5.5), filtre client ignoré
    //   autre membre connecté → PUBLIC + INTERNE
    //   visiteur public       → PUBLIC uniquement
    let confWhere: Record<string, unknown>;
    if (isStaff) {
      confWhere = confidentiality ? { confidentiality } : {};
    } else if (isRestricted) {
      const { documentIds, categoryIds } = await this.getGrantedIds(actor.sub);
      confWhere = {
        OR: [
          { confidentiality: Confidentiality.PUBLIC },
          ...(documentIds.length ? [{ id: { in: documentIds } }] : []),
          ...(categoryIds.length ? [{ categoryId: { in: categoryIds } }] : []),
        ],
      };
    } else if (actor) {
      confWhere = confidentiality
        ? { confidentiality }
        : { confidentiality: { in: [Confidentiality.PUBLIC, Confidentiality.INTERNE] } };
    } else {
      confWhere = { confidentiality: Confidentiality.PUBLIC };
    }

    const where = {
      ...statusWhere,
      ...(categoryId ? { categoryId } : {}),
      ...(uploadedById ? { uploadedById } : {}),
      AND: [
        confWhere,
        ...(q
          ? [{
              OR: [
                { title: { contains: q, mode: 'insensitive' as const } },
                { description: { contains: q, mode: 'insensitive' as const } },
                { tags: { has: q } },
              ],
            }]
          : []),
      ],
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
    await this.assertAccess(doc, actor);

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

    // Notifier l'admin si le doc part en attente de validation
    if (doc.status !== DocumentStatus.ACTIVE) {
      this.mail.notifyAdminNewDocument({
        docTitle:      doc.title,
        uploaderName:  doc.uploadedBy.fullName,
        uploaderEmail: (await this.prisma.user.findUnique({ where: { id: actor.sub }, select: { email: true } }))?.email ?? '',
        category:      doc.category.name,
      }).catch(() => null);
    }
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
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { uploadedBy: { select: { fullName: true, email: true } } },
    });
    const result = await this.update(id, { status: DocumentStatus.ACTIVE }, actor);
    if (doc?.uploadedBy?.email) {
      this.mail.notifyMemberDocApproved({
        to:         doc.uploadedBy.email,
        memberName: doc.uploadedBy.fullName,
        docTitle:   doc.title,
      }).catch(() => null);
    }
    return result;
  }

  async reject(id: string, actor: JwtPayload) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { uploadedBy: { select: { fullName: true, email: true } } },
    });
    const result = await this.update(id, { status: DocumentStatus.ARCHIVED }, actor);
    if (doc?.uploadedBy?.email) {
      this.mail.notifyMemberDocRejected({
        to:         doc.uploadedBy.email,
        memberName: doc.uploadedBy.fullName,
        docTitle:   doc.title,
      }).catch(() => null);
    }
    return result;
  }

  // ─── Privé ────────────────────────────────────────────────────────────────

  // Règles actives (non expirées) accordées à un utilisateur CONSULTANT/LECTEUR
  private async getGrantedIds(userId: string): Promise<{ documentIds: string[]; categoryIds: string[] }> {
    const now = new Date();
    const notExpired = { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] };
    const [docRules, catRules] = await Promise.all([
      this.prisma.documentAccessRule.findMany({ where: { userId, ...notExpired }, select: { documentId: true } }),
      this.prisma.categoryAccessRule.findMany({ where: { userId, ...notExpired }, select: { categoryId: true } }),
    ]);
    return {
      documentIds: docRules.map((r) => r.documentId),
      categoryIds: catRules.map((r) => r.categoryId),
    };
  }

  private async assertAccess(
    doc: { id: string; categoryId: string; confidentiality: Confidentiality },
    actor: JwtPayload | null,
  ) {
    if (doc.confidentiality === Confidentiality.PUBLIC) return;
    if (!actor) throw new ForbiddenException('Connexion requise pour accéder à ce document.');
    if (ADMIN_ROLES.includes(actor.role)) return;

    if (RESTRICTED_ROLES.includes(actor.role)) {
      const now = new Date();
      const notExpired = { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] };
      const [docRule, catRule] = await Promise.all([
        this.prisma.documentAccessRule.findFirst({ where: { documentId: doc.id, userId: actor.sub, ...notExpired } }),
        this.prisma.categoryAccessRule.findFirst({ where: { categoryId: doc.categoryId, userId: actor.sub, ...notExpired } }),
      ]);
      if (!docRule && !catRule) throw new ForbiddenException('Accès non autorisé à ce document.');
      return;
    }

    if (doc.confidentiality === Confidentiality.CONFIDENTIEL) {
      throw new ForbiddenException('Accès réservé aux administrateurs.');
    }
  }
}
