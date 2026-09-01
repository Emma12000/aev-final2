import { Test, TestingModule } from '@nestjs/testing';
import { PublicStatsService } from './public-stats.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PublicStatsService', () => {
  let service: PublicStatsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      document: {
        count: jest.fn().mockResolvedValue(0),
        groupBy: jest.fn().mockResolvedValue([]),
        aggregate: jest.fn().mockResolvedValue({ _sum: { pageCount: null, fileSize: null } }),
      },
      documentCategory: { findMany: jest.fn().mockResolvedValue([]) },
      $queryRaw: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicStatsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(PublicStatsService);
  });

  describe('resolvePeriod', () => {
    it('résout un trimestre en bornes UTC [from, to[', () => {
      const p = service.resolvePeriod('2026-Q1');
      expect(p.from).toBe('2026-01-01T00:00:00.000Z');
      expect(p.to).toBe('2026-04-01T00:00:00.000Z');
    });

    it('résout une année civile', () => {
      const p = service.resolvePeriod('2025');
      expect(p.from).toBe('2025-01-01T00:00:00.000Z');
      expect(p.to).toBe('2026-01-01T00:00:00.000Z');
    });

    it('retombe sur le trimestre courant sans paramètre', () => {
      expect(service.resolvePeriod().label).toMatch(/^\d{4}-Q[1-4]$/);
    });
  });

  // ── GARDE-FOU DE CONFIDENTIALITÉ ──────────────────────────────────────────
  // Ces tests protègent une promesse contractuelle : rien de ce que ce service
  // renvoie ne peut provenir d'un document INTERNE ou CONFIDENTIEL. Ne jamais
  // les assouplir pour faire passer une évolution.
  describe('cloisonnement des documents non publics', () => {
    it('filtre sur PUBLIC et exclut les supprimés dans CHAQUE requête Prisma', async () => {
      await service.getPublicStats('2026-Q1');

      const calls = [
        ...prisma.document.count.mock.calls,
        ...prisma.document.groupBy.mock.calls,
        ...prisma.document.aggregate.mock.calls,
      ];
      expect(calls.length).toBeGreaterThan(0);

      for (const [args] of calls) {
        expect(args.where.confidentiality).toBe('PUBLIC');
        expect(args.where.status).toEqual({ not: 'DELETED' });
      }
    });

    it("filtre sur PUBLIC dans chaque requête SQL brute", async () => {
      await service.getPublicStats('2026-Q1');

      expect(prisma.$queryRaw).toHaveBeenCalled();
      for (const [template, ...values] of prisma.$queryRaw.mock.calls) {
        const sql = (template as string[]).join('?');
        expect(sql).toContain('"confidentiality"::text =');
        expect(sql).toContain('"status"::text <>');
        expect(values).toContain('PUBLIC');
        expect(values).toContain('DELETED');
      }
    });

    it("n'interroge ni les utilisateurs ni les journaux d'activité", async () => {
      await service.getPublicStats('2026-Q1');
      expect(prisma.user).toBeUndefined();
      expect(prisma.activityLog).toBeUndefined();
    });

    it("ne renvoie aucun champ identifiant de document", async () => {
      const result = await service.getPublicStats('2026-Q1');
      const serialized = JSON.stringify(result);
      for (const forbidden of ['title', 'fileName', 'fileKey', 'uploadedBy', 'email']) {
        expect(serialized).not.toContain(forbidden);
      }
    });
  });

  describe('agrégats', () => {
    it('calcule la croissance par rapport à la période précédente de même longueur', async () => {
      prisma.document.count
        .mockResolvedValueOnce(120) // cumul
        .mockResolvedValueOnce(30) // période
        .mockResolvedValueOnce(24); // période précédente

      const result = await service.getPublicStats('2026-Q1');
      expect(result.totals.documentsInPeriod).toBe(30);
      expect(result.totals.growthPercent).toBe(25);
    });

    it('renvoie une croissance nulle (non infinie) quand la période précédente est vide', async () => {
      prisma.document.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(0);

      const result = await service.getPublicStats('2026-Q1');
      expect(result.totals.growthPercent).toBeNull();
    });

    it('produit 12 mois consécutifs, trous comblés à zéro', async () => {
      const result = await service.getPublicStats('2026-Q1');
      expect(result.monthly).toHaveLength(12);
      expect(result.monthly.every((m) => m.count === 0)).toBe(true);
      expect(result.monthly[0].month).toMatch(/^\d{4}-\d{2}$/);
    });
  });
});
