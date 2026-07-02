import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';

const mockCat = (overrides = {}) => ({
  id: 'cat-1',
  name: 'Rapports',
  slug: 'rapports',
  description: null,
  parentId: null,
  order: 0,
  icon: null,
  defaultConfidentiality: 'INTERNE' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  children: [],
  _count: { documents: 0 },
  ...overrides,
});

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: any;
  let activity: any;

  beforeEach(async () => {
    prisma = {
      documentCategory: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    activity = { log: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prisma },
        { provide: ActivityService, useValue: activity },
      ],
    }).compile();
    service = module.get(CategoriesService);
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('retourne les catégories racines avec leurs enfants', async () => {
      const cats = [mockCat(), mockCat({ id: 'cat-2', name: 'Procès-verbaux', slug: 'pv' })];
      prisma.documentCategory.findMany.mockResolvedValue(cats);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
      expect(prisma.documentCategory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { parentId: null } }),
      );
    });
  });

  // ─── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('retourne la catégorie si elle existe', async () => {
      prisma.documentCategory.findUnique.mockResolvedValue(mockCat());
      const result = await service.findOne('cat-1');
      expect(result.id).toBe('cat-1');
    });

    it('lance NotFoundException si catégorie introuvable', async () => {
      prisma.documentCategory.findUnique.mockResolvedValue(null);
      await expect(service.findOne('inexistant')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('crée une catégorie et journalise l\'action', async () => {
      prisma.documentCategory.findUnique.mockResolvedValue(null); // slug libre
      const cat = mockCat();
      prisma.documentCategory.create.mockResolvedValue(cat);

      const result = await service.create(
        { name: 'Rapports', slug: 'rapports' },
        'admin-1',
      );
      expect(result.slug).toBe('rapports');
      expect(activity.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CATEGORY_CREATE' }),
      );
    });

    it('lance ConflictException si le slug est déjà utilisé', async () => {
      prisma.documentCategory.findUnique.mockResolvedValue(mockCat()); // slug pris

      await expect(
        service.create({ name: 'Doublon', slug: 'rapports' }, 'admin-1'),
      ).rejects.toThrow(ConflictException);
      expect(prisma.documentCategory.create).not.toHaveBeenCalled();
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('met à jour la catégorie et journalise l\'action', async () => {
      prisma.documentCategory.findUnique.mockResolvedValue(mockCat());
      prisma.documentCategory.findFirst.mockResolvedValue(null); // pas de conflit de slug
      const updated = mockCat({ name: 'Rapports Modifiés' });
      prisma.documentCategory.update.mockResolvedValue(updated);

      const result = await service.update('cat-1', { name: 'Rapports Modifiés' }, 'admin-1');
      expect(result.name).toBe('Rapports Modifiés');
      expect(activity.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CATEGORY_UPDATE' }),
      );
    });

    it('lance NotFoundException si la catégorie n\'existe pas', async () => {
      prisma.documentCategory.findUnique.mockResolvedValue(null);
      await expect(service.update('inexistant', { name: 'Test' }, 'admin-1')).rejects.toThrow(NotFoundException);
    });

    it('lance ConflictException si le nouveau slug est déjà utilisé par une autre catégorie', async () => {
      prisma.documentCategory.findUnique.mockResolvedValue(mockCat());
      prisma.documentCategory.findFirst.mockResolvedValue(mockCat({ id: 'cat-autre' })); // conflit

      await expect(
        service.update('cat-1', { slug: 'pv' }, 'admin-1'),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('supprime la catégorie vide et journalise l\'action', async () => {
      prisma.documentCategory.findUnique.mockResolvedValue(mockCat({ _count: { documents: 0 } }));
      prisma.documentCategory.delete.mockResolvedValue({});

      await service.remove('cat-1', 'admin-1');
      expect(prisma.documentCategory.delete).toHaveBeenCalledWith({ where: { id: 'cat-1' } });
      expect(activity.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CATEGORY_DELETE' }),
      );
    });

    it('lance ConflictException si la catégorie contient des documents', async () => {
      prisma.documentCategory.findUnique.mockResolvedValue(mockCat({ _count: { documents: 3 } }));

      await expect(service.remove('cat-1', 'admin-1')).rejects.toThrow(ConflictException);
      expect(prisma.documentCategory.delete).not.toHaveBeenCalled();
    });
  });
});
