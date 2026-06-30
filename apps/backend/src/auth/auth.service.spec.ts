import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { MailService } from '../mail/mail.service';

const mockUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'test@espoiretvie.td',
  fullName: 'Test User',
  passwordHash: '$2b$12$hashedpassword',
  role: Role.LECTEUR,
  isActive: true,
  emailVerified: false,
  resetPasswordToken: null,
  resetPasswordExpires: null,
  emailVerifyToken: null,
  emailVerifyExpires: null,
  passwordChangedAt: null,
  lastLoginAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;
  let mail: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    jwt = { signAsync: jest.fn().mockResolvedValue('mock-token') };
    mail = {
      notifyAdminNewMember: jest.fn().mockResolvedValue(undefined),
      sendEmailVerification: jest.fn().mockResolvedValue(undefined),
      sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
        { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue(null) } },
        { provide: ActivityService, useValue: { log: jest.fn() } },
        { provide: MailService, useValue: mail },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  // ─── Login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('retourne les tokens si identifiants valides', async () => {
      const user = mockUser();
      prisma.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      prisma.user.update.mockResolvedValue(user);
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await service.login({ email: user.email, password: 'Password1!' });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(user.email);
    });

    it('lance UnauthorizedException si mot de passe incorrect', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser());
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      prisma.refreshToken.create.mockResolvedValue({});
      await expect(service.login({ email: 'test@espoiretvie.td', password: 'mauvais' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('lance UnauthorizedException si email inconnu', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login({ email: 'inconnu@test.td', password: 'password' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('lance UnauthorizedException si compte désactivé', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser({ isActive: false }));
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      await expect(service.login({ email: 'test@espoiretvie.td', password: 'Password1!' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('ne révèle pas si l\'email existe (message d\'erreur identique)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      let msg1 = '';
      try { await service.login({ email: 'inconnu@test.td', password: 'x' }); }
      catch (e: any) { msg1 = e.message; }

      prisma.user.findUnique.mockResolvedValue(mockUser());
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      prisma.refreshToken.create.mockResolvedValue({});
      let msg2 = '';
      try { await service.login({ email: 'test@espoiretvie.td', password: 'x' }); }
      catch (e: any) { msg2 = e.message; }

      expect(msg1).toBe(msg2);
    });
  });

  // ─── Register ──────────────────────────────────────────────────────────────

  describe('register', () => {
    it('crée un compte LECTEUR et retourne les tokens', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser({ role: Role.LECTEUR }));
      prisma.user.update.mockResolvedValue({});
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await service.register({
        fullName: 'Nouveau Membre',
        email: 'nouveau@espoiretvie.td',
        password: 'SecurePass1!',
      });
      expect(result.user.role).toBe(Role.LECTEUR);
      expect(result).toHaveProperty('accessToken');
    });

    it('lance ConflictException si email déjà enregistré', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser());
      await expect(service.register({
        fullName: 'Test',
        email: 'test@espoiretvie.td',
        password: 'SecurePass1!',
      })).rejects.toThrow(ConflictException);
    });

    it('normalise l\'email en minuscules', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser({ email: 'nouveau@espoiretvie.td' }));
      prisma.user.update.mockResolvedValue({});
      prisma.refreshToken.create.mockResolvedValue({});
      await service.register({
        fullName: 'Test',
        email: 'NOUVEAU@ESPOIRETVIE.TD',
        password: 'SecurePass1!',
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nouveau@espoiretvie.td' },
      });
    });

    it('notifie l\'admin après inscription (sans bloquer le retour)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser());
      prisma.user.update.mockResolvedValue({});
      prisma.refreshToken.create.mockResolvedValue({});
      await service.register({ fullName: 'Test', email: 'new@test.td', password: 'Pass1!' });
      // Notification envoyée de façon non-bloquante (fire-and-forget)
      expect(mail.notifyAdminNewMember).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Mot de passe oublié ───────────────────────────────────────────────────

  describe('forgotPassword', () => {
    it('ne lance pas d\'erreur si email inconnu (prévention d\'énumération)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.forgotPassword('inconnu@test.td')).resolves.toBeUndefined();
      expect(mail.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('ne lance pas d\'erreur si compte inactif (prévention d\'énumération)', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser({ isActive: false }));
      await expect(service.forgotPassword('test@espoiretvie.td')).resolves.toBeUndefined();
      expect(mail.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('envoie l\'email et stocke le token si email valide', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser());
      prisma.user.update.mockResolvedValue({});
      await service.forgotPassword('test@espoiretvie.td');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({
            resetPasswordToken: expect.any(String),
            resetPasswordExpires: expect.any(Date),
          }),
        }),
      );
    });
  });

  // ─── Réinitialisation mot de passe ─────────────────────────────────────────

  describe('resetPassword', () => {
    it('lance BadRequestException si token invalide ou expiré', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.resetPassword('token-invalide', 'NewPass1!'))
        .rejects.toThrow(BadRequestException);
    });

    it('lance BadRequestException si nouveau mot de passe trop court', async () => {
      await expect(service.resetPassword('token', 'court'))
        .rejects.toThrow(BadRequestException);
    });

    it('met à jour le mot de passe et révoque les refresh tokens', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser());
      prisma.user.update.mockResolvedValue({});
      prisma.refreshToken.updateMany.mockResolvedValue({});
      await service.resetPassword('token-valide', 'NouveauMdp1!');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            resetPasswordToken: null,
            resetPasswordExpires: null,
          }),
        }),
      );
      expect(prisma.refreshToken.updateMany).toHaveBeenCalled();
    });
  });

  // ─── Vérification email ────────────────────────────────────────────────────

  describe('verifyEmail', () => {
    it('lance BadRequestException si token invalide ou expiré', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.verifyEmail('token-invalide'))
        .rejects.toThrow(BadRequestException);
    });

    it('marque emailVerified=true et efface le token', async () => {
      prisma.user.findFirst.mockResolvedValue(mockUser());
      prisma.user.update.mockResolvedValue({});
      await service.verifyEmail('token-valide');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            emailVerified: true,
            emailVerifyToken: null,
            emailVerifyExpires: null,
          }),
        }),
      );
    });
  });
});
