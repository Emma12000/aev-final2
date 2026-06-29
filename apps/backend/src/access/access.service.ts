import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';

interface GrantDocumentDto {
  documentId: string;
  userId: string;
  permission?: Permission;
  expiresAt?: string;
}

interface GrantCategoryDto {
  categoryId: string;
  userId: string;
  expiresAt?: string;
}

@Injectable()
export class AccessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
  ) {}

  // ─── Document access ──────────────────────────────────────────────────────

  async listDocumentRules() {
    return this.prisma.documentAccessRule.findMany({
      include: {
        document:  { select: { id: true, title: true } },
        user:      { select: { id: true, fullName: true, email: true } },
        grantedBy: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async grantDocument(dto: GrantDocumentDto, grantedById: string) {
    const doc = await this.prisma.document.findUnique({ where: { id: dto.documentId } });
    if (!doc) throw new NotFoundException('Document introuvable.');

    const existing = await this.prisma.documentAccessRule.findUnique({
      where: { documentId_userId: { documentId: dto.documentId, userId: dto.userId } },
    });
    if (existing) throw new ConflictException('Accès déjà accordé.');

    const rule = await this.prisma.documentAccessRule.create({
      data: {
        documentId:  dto.documentId,
        userId:      dto.userId,
        grantedById,
        permission:  dto.permission ?? Permission.READ,
        expiresAt:   dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    await this.activity.log({
      userId: grantedById,
      action: 'ACCESS_GRANT',
      resourceType: 'document',
      resourceId: dto.documentId,
      metadata: { targetUserId: dto.userId, permission: rule.permission },
    });

    return rule;
  }

  async revokeDocument(ruleId: string, actorId: string) {
    const rule = await this.prisma.documentAccessRule.findUnique({ where: { id: ruleId } });
    if (!rule) throw new NotFoundException('Règle d\'accès introuvable.');

    await this.prisma.documentAccessRule.delete({ where: { id: ruleId } });

    await this.activity.log({
      userId: actorId,
      action: 'ACCESS_REVOKE',
      resourceType: 'document',
      resourceId: rule.documentId,
      metadata: { targetUserId: rule.userId },
    });
  }

  // ─── Category access ──────────────────────────────────────────────────────

  async listCategoryRules() {
    return this.prisma.categoryAccessRule.findMany({
      include: {
        category:  { select: { id: true, name: true, slug: true } },
        user:      { select: { id: true, fullName: true, email: true } },
        grantedBy: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async grantCategory(dto: GrantCategoryDto, grantedById: string) {
    const cat = await this.prisma.documentCategory.findUnique({ where: { id: dto.categoryId } });
    if (!cat) throw new NotFoundException('Catégorie introuvable.');

    const existing = await this.prisma.categoryAccessRule.findUnique({
      where: { categoryId_userId: { categoryId: dto.categoryId, userId: dto.userId } },
    });
    if (existing) throw new ConflictException('Accès déjà accordé.');

    const rule = await this.prisma.categoryAccessRule.create({
      data: {
        categoryId:  dto.categoryId,
        userId:      dto.userId,
        grantedById,
        expiresAt:   dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    await this.activity.log({
      userId: grantedById,
      action: 'ACCESS_GRANT',
      resourceType: 'category',
      resourceId: dto.categoryId,
      metadata: { targetUserId: dto.userId },
    });

    return rule;
  }

  async revokeCategory(ruleId: string, actorId: string) {
    const rule = await this.prisma.categoryAccessRule.findUnique({ where: { id: ruleId } });
    if (!rule) throw new NotFoundException('Règle d\'accès introuvable.');

    await this.prisma.categoryAccessRule.delete({ where: { id: ruleId } });

    await this.activity.log({
      userId: actorId,
      action: 'ACCESS_REVOKE',
      resourceType: 'category',
      resourceId: rule.categoryId,
      metadata: { targetUserId: rule.userId },
    });
  }
}
