import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalDocuments,
      totalUsers,
      activeUsers,
      totalCategories,
      docsByCategory,
      docsByStatus,
      usersByRole,
      recentUploads,
      recentActivity,
    ] = await Promise.all([
      this.prisma.document.count({ where: { status: { not: 'DELETED' } } }),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.documentCategory.count(),
      this.prisma.document.groupBy({
        by: ['categoryId'],
        where: { status: { not: 'DELETED' } },
        _count: { id: true },
      }),
      this.prisma.document.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
      }),
      this.prisma.document.count({
        where: { createdAt: { gte: thirtyDaysAgo }, status: { not: 'DELETED' } },
      }),
      this.prisma.activityLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true, email: true } } },
      }),
    ]);

    // Enrichir docsByCategory avec le nom de la catégorie
    const categoryIds = docsByCategory.map((d: { categoryId: string }) => d.categoryId);
    const categories = await this.prisma.documentCategory.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, slug: true, icon: true },
    });
    const catMap = Object.fromEntries(categories.map((c: { id: string; name: string; slug: string; icon: string | null }) => [c.id, c]));

    return {
      documents: {
        total: totalDocuments,
        recentUploads,
        byStatus: docsByStatus.map((s: { status: string; _count: { id: number } }) => ({ status: s.status, count: s._count.id })),
        byCategory: docsByCategory.map((d: { categoryId: string; _count: { id: number } }) => ({
          category: catMap[d.categoryId] ?? { id: d.categoryId, name: 'Inconnue', slug: '', icon: null },
          count: d._count.id,
        })),
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        byRole: usersByRole.map((r: { role: string; _count: { id: number } }) => ({ role: r.role, count: r._count.id })),
      },
      categories: { total: totalCategories },
      recentActivity,
    };
  }
}
