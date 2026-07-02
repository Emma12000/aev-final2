import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { MailService } from '../mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly activity: ActivityService,
    private readonly mail: MailService,
  ) {}

  // ─── Login ────────────────────────────────────────────────────────────────

  async login(dto: LoginDto, ip?: string, ua?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });

    // Toujours exécuter bcrypt (timing constant) — évite l'énumération d'emails par mesure de durée
    const TIMING_HASH = '$2b$12$LCzJK7kJEXMJiKmIvlOVBuI2p.bqNDqJAq.2x0lkXQsmyXyIqRVFq';
    const hashToCompare = (user?.isActive && user.passwordHash) ? user.passwordHash : TIMING_HASH;
    const bcryptResult = await bcrypt.compare(dto.password, hashToCompare);
    const passwordValid = !!(user?.isActive && user.passwordHash && bcryptResult);

    if (!passwordValid) {
      if (user) {
        await this.activity.log({ userId: user.id, action: 'LOGIN_FAILED', resourceType: 'auth', ipAddress: ip, userAgent: ua });
      }
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    await this.activity.log({ userId: user.id, action: 'LOGIN', resourceType: 'auth', ipAddress: ip, userAgent: ua });

    return {
      ...tokens,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    };
  }

  // ─── Register ─────────────────────────────────────────────────────────────

  async register(dto: RegisterDto, ip?: string, ua?: string) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (exists) throw new ConflictException('Un compte existe déjà avec cet email.');

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        fullName: dto.fullName,
        passwordHash,
        role: Role.LECTEUR,
      },
    });

    const tokens = await this.generateTokens(user.id, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    await this.activity.log({ userId: user.id, action: 'USER_CREATE', resourceType: 'user', resourceId: user.id, ipAddress: ip, userAgent: ua });

    // Envoyer email de vérification
    const rawVerifyToken = crypto.randomBytes(32).toString('hex');
    const verifyHash = this.hashToken(rawVerifyToken);
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerifyToken: verifyHash, emailVerifyExpires: verifyExpires },
    });
    const appUrl = this.config.get<string>('app.url') ?? 'https://archive.espoiretvie.td';
    this.mail.sendEmailVerification({
      to: user.email,
      name: user.fullName,
      verifyUrl: `${appUrl}?verify=${rawVerifyToken}`,
    }).catch(() => null);

    // Notifier l'admin de la nouvelle inscription
    this.mail.notifyAdminNewMember({
      memberName:  user.fullName,
      memberEmail: user.email,
      role:        user.role,
    }).catch(() => null);

    return {
      ...tokens,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, emailVerified: false },
    };
  }

  // ─── Refresh ──────────────────────────────────────────────────────────────

  async refresh(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { select: { id: true, role: true, isActive: true } } },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Token de rafraîchissement invalide ou expiré.');
    }
    if (!stored.user.isActive) {
      throw new UnauthorizedException('Compte inactif.');
    }

    // Rotation : invalider l'ancien token
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.generateTokens(stored.user.id, stored.user.role);
    await this.storeRefreshToken(stored.user.id, tokens.refreshToken);
    return tokens;
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  async logout(userId: string, rawToken: string, ip?: string, ua?: string) {
    const tokenHash = this.hashToken(rawToken);
    await this.prisma.refreshToken
      .updateMany({
        where: { userId, tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      })
      .catch(() => null);
    await this.activity.log({ userId, action: 'LOGOUT', resourceType: 'auth', ipAddress: ip, userAgent: ua });
  }

  // ─── Privé ────────────────────────────────────────────────────────────────

  private async generateTokens(userId: string, role: Role) {
    const payload = { sub: userId, role };

    const privateKey = this.config.get<string>('jwt.privateKey');
    const secret = this.config.get<string>('jwt.secret') || '';

    if (!privateKey && !secret) {
      throw new Error('Configuration JWT manquante : définir JWT_PRIVATE_KEY (RS256) ou JWT_SECRET (HS256) dans les variables d\'environnement.');
    }

    const signOptions = privateKey
      ? { algorithm: 'RS256' as const, privateKey }
      : { secret };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        ...signOptions,
        expiresIn: this.config.get<string>('jwt.accessExpiresIn') ?? '15m',
      }),
      this.jwt.signAsync(payload, {
        ...signOptions,
        expiresIn: this.config.get<string>('jwt.refreshExpiresIn') ?? '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, rawToken: string) {
    const tokenHash = this.hashToken(rawToken);
    const expiresIn = this.config.get<string>('jwt.refreshExpiresIn') ?? '7d';
    const days = parseInt(expiresIn) || 7;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await this.prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
  }

  private hashToken(raw: string): string {
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  async updateProfile(userId: string, fullName?: string) {
    if (!fullName?.trim()) throw new BadRequestException('Le nom complet est requis.');
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { fullName: fullName.trim() },
      select: { id: true, email: true, fullName: true, role: true, emailVerified: true },
    });
    return user;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, role: true, createdAt: true, lastLoginAt: true, emailVerified: true },
    });
    return user;
  }

  // ─── Google OAuth ─────────────────────────────────────────────────────────

  async googleAuth(idToken: string) {
    const clientId = this.config.get<string>('google.clientId');
    if (!clientId) throw new BadRequestException('Google OAuth non configuré.');

    const client = new OAuth2Client(clientId);
    let payload: any;
    try {
      const ticket = await client.verifyIdToken({ idToken, audience: clientId });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Token Google invalide.');
    }

    if (!payload?.email_verified) throw new UnauthorizedException('Email Google non vérifié.');

    const email = payload.email.toLowerCase();
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          fullName: payload.name || email,
          passwordHash: '',
          role: Role.LECTEUR,
          emailVerified: true,
        },
      });
      this.mail.notifyAdminNewMember({ memberName: user.fullName, memberEmail: user.email, role: user.role }).catch(() => null);
      await this.activity.log({ userId: user.id, action: 'USER_CREATE', resourceType: 'user', resourceId: user.id });
    }

    if (!user.isActive) throw new UnauthorizedException('Compte désactivé.');

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const tokens = await this.generateTokens(user.id, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    await this.activity.log({ userId: user.id, action: 'LOGIN', resourceType: 'auth' });

    return {
      ...tokens,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, emailVerified: true },
    };
  }

  // ─── Vérification email ───────────────────────────────────────────────────

  async verifyEmail(token: string) {
    const tokenHash = this.hashToken(token);
    const user = await this.prisma.user.findFirst({
      where: { emailVerifyToken: tokenHash, emailVerifyExpires: { gt: new Date() } },
    });
    if (!user) throw new BadRequestException('Lien de vérification invalide ou expiré.');
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null, emailVerifyExpires: null },
    });
  }

  async resendVerification(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.emailVerified) throw new BadRequestException('Email déjà vérifié.');
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerifyToken: tokenHash, emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    });
    const appUrl = this.config.get<string>('app.url') ?? 'https://archive.espoiretvie.td';
    this.mail.sendEmailVerification({
      to: user.email,
      name: user.fullName,
      verifyUrl: `${appUrl}?verify=${rawToken}`,
    }).catch(() => null);
  }

  // ─── Mot de passe oublié ──────────────────────────────────────────────────

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.isActive) return; // Ne pas révéler si l'email existe

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: tokenHash, resetPasswordExpires: expires },
    });

    const appUrl = this.config.get<string>('app.url') ?? 'https://archive.espoiretvie.td';
    const resetUrl = `${appUrl}?reset=${rawToken}`;

    this.mail.sendPasswordResetEmail({ to: user.email, name: user.fullName, resetUrl }).catch(() => null);
  }

  async resetPassword(token: string, newPassword: string) {
    if (newPassword.length < 8) throw new BadRequestException('Le mot de passe doit contenir au moins 8 caractères.');

    const tokenHash = this.hashToken(token);
    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: tokenHash, resetPasswordExpires: { gt: new Date() } },
    });

    if (!user) throw new BadRequestException('Lien de réinitialisation invalide ou expiré.');

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, passwordChangedAt: new Date(), resetPasswordToken: null, resetPasswordExpires: null },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ─── Changement de mot de passe ──────────────────────────────────────────

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    if (newPassword.length < 8) throw new BadRequestException('Nouveau mot de passe trop court.');
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Ancien mot de passe incorrect.');
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash, passwordChangedAt: new Date() } });
    // Révoquer tous les refresh tokens
    await this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  }
}
