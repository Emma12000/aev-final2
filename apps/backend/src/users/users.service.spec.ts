import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';

const mockUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'agent@espoiretvie.td',
  fullName: 'Agent Test',
  role: Role.AGENT,
  isActive: true,
  emailVerified: true,
  createdAt: new Date(),
  lastLoginAt: null,
  ...overrides,
});

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;
  let activity: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
        groupBy: jest.fn(),
      },
    };
    activity = { log: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        { provide: ActivityService, useValue: activity },
      ],
    }).compile();
    service = module.get(UsersService);
  });

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('retourne la liste paginée des utilisateurs', async () => {
      prisma.user.findMany.mockResolvedValue([mockUser()]);
      prisma.user.count.mockResolvedValue(1);

      const result = await service.findAll(1, 20);
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.page).toBe(1);
    });

    it('filtre par rôle si fourni', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await service.findAll(1, 20, Role.AGENT);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { role: Role.AGENT } }),
      );
    });
  });

  // ─── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('retourne l\'utilisateur si il existe', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser());
      const result = await service.findOne('user-1');
      expect(result.id).toBe('user-1');
    });

    it('lance NotFoundException si l\'utilisateur est introuvable', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne('inexistant')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('crée un utilisateur avec le rôle spécifié', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);
      const created = mockUser({ role: Role.SUPERVISEUR });
      prisma.user.create.mockResolvedValue(created);

      const result = await service.create(
        { email: 'superviseur@espoiretvie.td', fullName: 'Superviseur', password: 'Pass1!', role: Role.SUPERVISEUR },
        'admin-1',
      );
      expect(result.role).toBe(Role.SUPERVISEUR);
      expect(activity.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'USER_CREATE' }),
      );
    });

    it('crée un utilisateur LECTEUR par défaut si rôle absent', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);
      prisma.user.create.mockResolvedValue(mockUser({ role: Role.LECTEUR }));

      const result = await service.create(
        { email: 'lecteur@espoiretvie.td', fullName: 'Lecteur', password: 'Pass1!' },
        'admin-1',
      );
      expect(result.role).toBe(Role.LECTEUR);
    });

    it('normalise l\'email en minuscules', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);
      prisma.user.create.mockResolvedValue(mockUser());

      await service.create(
        { email: 'AGENT@ESPOIRETVIE.TD', fullName: 'Agent', password: 'Pass1!' },
        'admin-1',
      );
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ email: 'agent@espoiretvie.td' }),
        }),
      );
    });

    it('lance ConflictException si l\'email est déjà pris', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser());

      await expect(
        service.create({ email: 'agent@espoiretvie.td', fullName: 'Test', password: 'Pass1!' }, 'admin-1'),
      ).rejects.toThrow(ConflictException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('met à jour les données de l\'utilisateur', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser());
      const updated = mockUser({ fullName: 'Nouveau Nom' });
      prisma.user.update.mockResolvedValue(updated);

      const result = await service.update('user-1', { fullName: 'Nouveau Nom' }, 'admin-1');
      expect(result.fullName).toBe('Nouveau Nom');
      expect(activity.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'USER_UPDATE' }),
      );
    });

    it('lance NotFoundException si l\'utilisateur n\'existe pas', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.update('inexistant', { fullName: 'Test' }, 'admin-1')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('désactive l\'utilisateur (soft delete) et journalise', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser());
      prisma.user.update.mockResolvedValue({});

      await service.remove('user-1', 'admin-1');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { isActive: false } }),
      );
      expect(activity.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'USER_DELETE' }),
      );
    });

    it('lance NotFoundException si l\'utilisateur n\'existe pas', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.remove('inexistant', 'admin-1')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── stats ─────────────────────────────────────────────────────────────────

  describe('stats', () => {
    it('retourne le total et la répartition par rôle', async () => {
      prisma.user.count.mockResolvedValue(10);
      prisma.user.groupBy.mockResolvedValue([
        { role: Role.ADMINISTRATEUR, _count: { id: 1 } },
        { role: Role.AGENT, _count: { id: 5 } },
        { role: Role.LECTEUR, _count: { id: 4 } },
      ]);

      const result = await service.stats();
      expect(result.total).toBe(10);
      expect(result.byRole).toHaveLength(3);
      expect(result.byRole[0]).toEqual({ role: Role.ADMINISTRATEUR, count: 1 });
    });
  });
});
