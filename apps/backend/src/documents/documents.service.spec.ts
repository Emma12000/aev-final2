import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Confidentiality, DocumentStatus, Role } from '@prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from './storage.service';
import { ActivityService } from '../activity/activity.service';
import { MailService } from '../mail/mail.service';

const mockDoc = (conf: Confidentiality, id = 'doc-1', catId = 'cat-1') => ({
  id,
  title: 'Test doc',
  categoryId: catId,
  confidentiality: conf,
  status: DocumentStatus.ACTIVE,
  description: null,
  fileName: 'file.pdf',
  fileKey: 'documents/admin/file.pdf',
  fileMimeType: 'application/pdf',
  fileSize: 1024,
  tags: [],
  uploadedById: 'user-1',
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: { id: catId, name: 'Admin', slug: 'admin' },
  uploadedBy: { id: 'user-1', fullName: 'Test User' },
});

const actor = (role: Role, id = 'user-1') => ({ sub: id, role, email: 'test@aev.td' });

describe('DocumentsService — contrôle d\'accès par rôle', () => {
  let service: DocumentsService;
  let prisma: any;

  const mockPrisma = () => ({
    document: {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
    },
    documentAccessRule: { findMany: jest.fn().mockResolvedValue([]), findFirst: jest.fn().mockResolvedValue(null) },
    categoryAccessRule: { findMany: jest.fn().mockResolvedValue([]), findFirst: jest.fn().mockResolvedValue(null) },
    documentCategory: { findUnique: jest.fn() },
    user: { findUnique: jest.fn() },
  });

  beforeEach(async () => {
    prisma = mockPrisma();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: StorageService, useValue: { upload: jest.fn(), getSignedUrl: jest.fn(), delete: jest.fn() } },
        { provide: ActivityService, useValue: { log: jest.fn() } },
        { provide: MailService, useValue: { notifyAdminNewDocument: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue([]) } },
      ],
    }).compile();
    service = module.get(DocumentsService);
  });

  describe('findAll — filtre confidentialité', () => {
    it('ADMINISTRATEUR voit tout (aucun filtre confidentialité)', async () => {
      await service.findAll({}, actor(Role.ADMINISTRATEUR));
      const where = prisma.document.findMany.mock.calls[0][0].where;
      const andClause = where.AND[0];
      // Aucun filtre confidentialité pour les admins
      expect(andClause).toEqual({});
    });

    it('SUPERVISEUR voit tout comme ADMINISTRATEUR', async () => {
      await service.findAll({}, actor(Role.SUPERVISEUR));
      const where = prisma.document.findMany.mock.calls[0][0].where;
      expect(where.AND[0]).toEqual({});
    });

    it('AGENT voit PUBLIC + INTERNE uniquement', async () => {
      await service.findAll({}, actor(Role.AGENT));
      const where = prisma.document.findMany.mock.calls[0][0].where;
      const confFilter = where.AND[0];
      expect(confFilter).toEqual({
        confidentiality: { in: [Confidentiality.PUBLIC, Confidentiality.INTERNE] },
      });
    });

    it('CONSULTANT voit uniquement PUBLIC (aucune règle accordée)', async () => {
      prisma.documentAccessRule.findMany.mockResolvedValue([]);
      prisma.categoryAccessRule.findMany.mockResolvedValue([]);
      await service.findAll({}, actor(Role.CONSULTANT));
      const where = prisma.document.findMany.mock.calls[0][0].where;
      const confFilter = where.AND[0];
      expect(confFilter.OR).toContainEqual({ confidentiality: Confidentiality.PUBLIC });
      // Aucun doc ou catégorie accordé
      expect(confFilter.OR).toHaveLength(1);
    });

    it('CONSULTANT voit PUBLIC + docs explicitement accordés', async () => {
      prisma.documentAccessRule.findMany.mockResolvedValue([{ documentId: 'doc-secret' }]);
      prisma.categoryAccessRule.findMany.mockResolvedValue([]);
      await service.findAll({}, actor(Role.CONSULTANT));
      const where = prisma.document.findMany.mock.calls[0][0].where;
      const or = where.AND[0].OR;
      expect(or).toContainEqual({ confidentiality: Confidentiality.PUBLIC });
      expect(or).toContainEqual({ id: { in: ['doc-secret'] } });
    });

    it('CONSULTANT voit PUBLIC + catégories accordées', async () => {
      prisma.documentAccessRule.findMany.mockResolvedValue([]);
      prisma.categoryAccessRule.findMany.mockResolvedValue([{ categoryId: 'cat-finance' }]);
      await service.findAll({}, actor(Role.CONSULTANT));
      const or = prisma.document.findMany.mock.calls[0][0].where.AND[0].OR;
      expect(or).toContainEqual({ categoryId: { in: ['cat-finance'] } });
    });

    it('LECTEUR se comporte comme CONSULTANT (PUBLIC + accordés uniquement)', async () => {
      prisma.documentAccessRule.findMany.mockResolvedValue([]);
      prisma.categoryAccessRule.findMany.mockResolvedValue([]);
      await service.findAll({}, actor(Role.LECTEUR));
      const confFilter = prisma.document.findMany.mock.calls[0][0].where.AND[0];
      expect(confFilter.OR).toContainEqual({ confidentiality: Confidentiality.PUBLIC });
      expect(confFilter.OR).toHaveLength(1);
    });

    it('visiteur anonyme (null) voit PUBLIC uniquement', async () => {
      await service.findAll({}, null as any);
      const where = prisma.document.findMany.mock.calls[0][0].where;
      expect(where.AND[0]).toEqual({ confidentiality: Confidentiality.PUBLIC });
    });

    it('recherche + accès CONSULTANT ne s\'écrasent pas (AND correct)', async () => {
      prisma.documentAccessRule.findMany.mockResolvedValue([]);
      prisma.categoryAccessRule.findMany.mockResolvedValue([]);
      await service.findAll({ q: 'rapport' }, actor(Role.CONSULTANT));
      const andArray = prisma.document.findMany.mock.calls[0][0].where.AND;
      // Doit y avoir 2 éléments dans AND : filtre accès + filtre recherche
      expect(andArray.length).toBe(2);
      expect(andArray[0].OR).toBeDefined();          // filtre confidentialité
      expect(andArray[1].OR).toBeDefined();          // filtre recherche texte
      expect(andArray[1].OR[0].title).toBeDefined(); // contient filtre titre
    });
  });

  describe('findOne — assertAccess', () => {
    it('CONSULTANT peut voir un document PUBLIC sans règle accordée', async () => {
      const doc = mockDoc(Confidentiality.PUBLIC);
      prisma.document.findUnique.mockResolvedValue(doc);
      await expect(service.findOne('doc-1', actor(Role.CONSULTANT))).resolves.toBeTruthy();
    });

    it('CONSULTANT ne peut pas voir un doc INTERNE sans règle accordée', async () => {
      const doc = mockDoc(Confidentiality.INTERNE);
      prisma.document.findUnique.mockResolvedValue(doc);
      prisma.documentAccessRule.findFirst.mockResolvedValue(null);
      prisma.categoryAccessRule.findFirst.mockResolvedValue(null);
      await expect(service.findOne('doc-1', actor(Role.CONSULTANT)))
        .rejects.toThrow(ForbiddenException);
    });

    it('CONSULTANT peut voir un doc INTERNE si règle document accordée', async () => {
      const doc = mockDoc(Confidentiality.INTERNE);
      prisma.document.findUnique.mockResolvedValue(doc);
      prisma.documentAccessRule.findFirst.mockResolvedValue({ id: 'rule-1' });
      prisma.categoryAccessRule.findFirst.mockResolvedValue(null);
      await expect(service.findOne('doc-1', actor(Role.CONSULTANT))).resolves.toBeTruthy();
    });

    it('CONSULTANT peut voir un doc INTERNE si règle catégorie accordée', async () => {
      const doc = mockDoc(Confidentiality.INTERNE);
      prisma.document.findUnique.mockResolvedValue(doc);
      prisma.documentAccessRule.findFirst.mockResolvedValue(null);
      prisma.categoryAccessRule.findFirst.mockResolvedValue({ id: 'rule-2' });
      await expect(service.findOne('doc-1', actor(Role.CONSULTANT))).resolves.toBeTruthy();
    });

    it('AGENT peut voir un doc INTERNE sans règle explicite', async () => {
      const doc = mockDoc(Confidentiality.INTERNE);
      prisma.document.findUnique.mockResolvedValue(doc);
      await expect(service.findOne('doc-1', actor(Role.AGENT))).resolves.toBeTruthy();
    });

    it('AGENT ne peut pas voir un doc CONFIDENTIEL', async () => {
      const doc = mockDoc(Confidentiality.CONFIDENTIEL);
      prisma.document.findUnique.mockResolvedValue(doc);
      await expect(service.findOne('doc-1', actor(Role.AGENT)))
        .rejects.toThrow(ForbiddenException);
    });

    it('ADMINISTRATEUR peut voir un doc CONFIDENTIEL', async () => {
      const doc = mockDoc(Confidentiality.CONFIDENTIEL);
      prisma.document.findUnique.mockResolvedValue(doc);
      await expect(service.findOne('doc-1', actor(Role.ADMINISTRATEUR))).resolves.toBeTruthy();
    });

    it('retourne 404 si document introuvable', async () => {
      prisma.document.findUnique.mockResolvedValue(null);
      await expect(service.findOne('doc-inexistant', actor(Role.ADMINISTRATEUR)))
        .rejects.toThrow(NotFoundException);
    });
  });
});
