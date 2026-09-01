import { Injectable } from '@nestjs/common';
import { Confidentiality, DocumentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Périmètre de diffusion publique.
 *
 * GARDE-FOU : ce filtre est la SEULE porte d'entrée de ce service vers la base.
 * Il ne doit jamais être élargi, paramétré, ni contourné — les données produites
 * ici alimentent des vidéos publiées publiquement (bailleurs, réseaux sociaux).
 * Un document INTERNE ou CONFIDENTIEL ne doit jamais influencer un chiffre affiché.
 */
const PUBLIC_SCOPE = {
  confidentiality: Confidentiality.PUBLIC,
  status: { not: DocumentStatus.DELETED },
} satisfies Prisma.DocumentWhereInput;

export interface PublicStatsPeriod {
  label: string;
  from: string;
  to: string;
}

export interface PublicStats {
  period: PublicStatsPeriod;
  totals: {
    documents: number;
    documentsInPeriod: number;
    documentsPreviousPeriod: number;
    growthPercent: number | null;
    pages: number;
    categories: number;
    megabytes: number;
  };
  byCategory: { name: string; slug: string; icon: string | null; count: number }[];
  monthly: { month: string; count: number }[];
  topTags: { tag: string; count: number }[];
  generatedAt: string;
}

@Injectable()
export class PublicStatsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Résout `2026-Q1` / `2026` en bornes UTC [from, to[. Par défaut : trimestre courant. */
  resolvePeriod(period?: string): PublicStatsPeriod & { fromDate: Date; toDate: Date } {
    const now = new Date();
    const label = period ?? `${now.getUTCFullYear()}-Q${Math.floor(now.getUTCMonth() / 3) + 1}`;

    const [yearPart, quarterPart] = label.split('-Q');
    const year = Number(yearPart);
    const fromDate = quarterPart
      ? new Date(Date.UTC(year, (Number(quarterPart) - 1) * 3, 1))
      : new Date(Date.UTC(year, 0, 1));
    const toDate = quarterPart
      ? new Date(Date.UTC(year, Number(quarterPart) * 3, 1))
      : new Date(Date.UTC(year + 1, 0, 1));

    return { label, from: fromDate.toISOString(), to: toDate.toISOString(), fromDate, toDate };
  }

  async getPublicStats(period?: string): Promise<PublicStats> {
    const { label, from, to, fromDate, toDate } = this.resolvePeriod(period);

    // Période précédente, de même longueur, pour le taux de croissance.
    const spanMs = toDate.getTime() - fromDate.getTime();
    const previousFrom = new Date(fromDate.getTime() - spanMs);

    const [cumulative, inPeriod, previousPeriod, byCategoryRaw, aggregates, monthlyRaw, tagsRaw] =
      await Promise.all([
        this.prisma.document.count({
          where: { ...PUBLIC_SCOPE, createdAt: { lt: toDate } },
        }),
        this.prisma.document.count({
          where: { ...PUBLIC_SCOPE, createdAt: { gte: fromDate, lt: toDate } },
        }),
        this.prisma.document.count({
          where: { ...PUBLIC_SCOPE, createdAt: { gte: previousFrom, lt: fromDate } },
        }),
        this.prisma.document.groupBy({
          by: ['categoryId'],
          where: { ...PUBLIC_SCOPE, createdAt: { lt: toDate } },
          _count: { id: true },
        }),
        this.prisma.document.aggregate({
          where: { ...PUBLIC_SCOPE, createdAt: { lt: toDate } },
          _sum: { pageCount: true, fileSize: true },
        }),
        this.monthlySeries(toDate),
        this.topTags(toDate),
      ]);

    const categories = await this.prisma.documentCategory.findMany({
      where: { id: { in: byCategoryRaw.map((c) => c.categoryId) } },
      select: { id: true, name: true, slug: true, icon: true },
    });
    const catMap = new Map(categories.map((c) => [c.id, c]));

    const byCategory = byCategoryRaw
      .map((c) => {
        const cat = catMap.get(c.categoryId);
        return {
          name: cat?.name ?? 'Non classé',
          slug: cat?.slug ?? 'non-classe',
          icon: cat?.icon ?? null,
          count: c._count.id,
        };
      })
      .sort((a, b) => b.count - a.count);

    return {
      period: { label, from, to },
      totals: {
        documents: cumulative,
        documentsInPeriod: inPeriod,
        documentsPreviousPeriod: previousPeriod,
        growthPercent:
          previousPeriod > 0
            ? Math.round(((inPeriod - previousPeriod) / previousPeriod) * 1000) / 10
            : null,
        pages: aggregates._sum.pageCount ?? 0,
        categories: byCategory.length,
        megabytes: Math.round((aggregates._sum.fileSize ?? 0) / 1024 / 1024),
      },
      byCategory,
      monthly: monthlyRaw,
      topTags: tagsRaw,
      generatedAt: new Date().toISOString(),
    };
  }

  /** 12 derniers mois de versements publics, mois vides inclus (une vidéo ne tolère pas les trous). */
  private async monthlySeries(toDate: Date): Promise<{ month: string; count: number }[]> {
    const start = new Date(Date.UTC(toDate.getUTCFullYear(), toDate.getUTCMonth() - 12, 1));

    const rows = await this.prisma.$queryRaw<{ month: Date; count: bigint }[]>`
      SELECT date_trunc('month', "createdAt") AS month, COUNT(*)::bigint AS count
      FROM "documents"
      WHERE "confidentiality"::text = ${Confidentiality.PUBLIC}
        AND "status"::text <> ${DocumentStatus.DELETED}
        AND "createdAt" >= ${start}
        AND "createdAt" < ${toDate}
      GROUP BY 1
      ORDER BY 1
    `;

    const counts = new Map(
      rows.map((r) => [new Date(r.month).toISOString().slice(0, 7), Number(r.count)]),
    );

    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1));
      const key = d.toISOString().slice(0, 7);
      return { month: key, count: counts.get(key) ?? 0 };
    });
  }

  /** Tags les plus fréquents. Les tags sont saisis par les agents : on les traite comme du texte affichable. */
  private async topTags(toDate: Date): Promise<{ tag: string; count: number }[]> {
    const rows = await this.prisma.$queryRaw<{ tag: string; count: bigint }[]>`
      SELECT unnest("tags") AS tag, COUNT(*)::bigint AS count
      FROM "documents"
      WHERE "confidentiality"::text = ${Confidentiality.PUBLIC}
        AND "status"::text <> ${DocumentStatus.DELETED}
        AND "createdAt" < ${toDate}
      GROUP BY 1
      ORDER BY count DESC, tag ASC
      LIMIT 8
    `;
    return rows.map((r) => ({ tag: r.tag, count: Number(r.count) }));
  }
}
