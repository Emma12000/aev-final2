import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockTokens = {
  accessToken: 'access-mock',
  refreshToken: 'refresh-mock',
  user: { id: 'u1', email: 'test@aev.td', fullName: 'Test', role: 'LECTEUR', emailVerified: false },
};

const mockRes = () => {
  const res: any = {};
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (cookies: Record<string, string> = {}, overrides = {}) => ({
  cookies,
  ip: '127.0.0.1',
  headers: { 'user-agent': 'jest' },
  ...overrides,
});

describe('AuthController — cookie httpOnly', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(async () => {
    authService = {
      login: jest.fn().mockResolvedValue(mockTokens),
      register: jest.fn().mockResolvedValue(mockTokens),
      refresh: jest.fn().mockResolvedValue({ accessToken: 'new-access', refreshToken: 'new-refresh' }),
      googleAuth: jest.fn().mockResolvedValue(mockTokens),
      logout: jest.fn().mockResolvedValue(undefined),
      forgotPassword: jest.fn().mockResolvedValue(undefined),
      resetPassword: jest.fn().mockResolvedValue(undefined),
      verifyEmail: jest.fn().mockResolvedValue(undefined),
      resendVerification: jest.fn().mockResolvedValue(undefined),
      getProfile: jest.fn().mockResolvedValue(mockTokens.user),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(AuthController);
  });

  // ─── Login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('pose le cookie httpOnly avec le refresh token', async () => {
      const res = mockRes();
      await controller.login({ email: 'test@aev.td', password: 'Pass1!' }, mockReq() as any, res);
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh-mock',
        expect.objectContaining({ httpOnly: true, secure: true }),
      );
    });

    it('ne retourne PAS le refresh token dans le body JSON', async () => {
      const res = mockRes();
      const result = await controller.login({ email: 'test@aev.td', password: 'Pass1!' }, mockReq() as any, res);
      expect(result).not.toHaveProperty('refreshToken');
      expect(result).toHaveProperty('accessToken');
    });
  });

  // ─── Register ──────────────────────────────────────────────────────────────

  describe('register', () => {
    it('pose le cookie httpOnly après inscription', async () => {
      const res = mockRes();
      await controller.register(
        { fullName: 'Test', email: 't@t.td', password: 'Pass1!' },
        mockReq() as any,
        res,
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.any(String),
        expect.objectContaining({ httpOnly: true }),
      );
    });
  });

  // ─── Refresh ───────────────────────────────────────────────────────────────

  describe('refresh', () => {
    it('lit le cookie et retourne un nouvel access token', async () => {
      const res = mockRes();
      const result = await controller.refresh(
        mockReq({ refresh_token: 'old-refresh' }) as any,
        res,
      );
      expect(authService.refresh).toHaveBeenCalledWith('old-refresh');
      expect(result).toHaveProperty('accessToken', 'new-access');
      expect(result).not.toHaveProperty('refreshToken');
      // Nouveau cookie posé (rotation)
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'new-refresh',
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('lance UnauthorizedException si cookie absent', async () => {
      const res = mockRes();
      await expect(controller.refresh(mockReq({}) as any, res))
        .rejects.toThrow(UnauthorizedException);
      expect(authService.refresh).not.toHaveBeenCalled();
    });
  });

  // ─── Logout ────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('révoque le token en base et efface le cookie', async () => {
      const res = mockRes();
      const user = { sub: 'u1', role: 'LECTEUR' } as any;
      await controller.logout(user, mockReq({ refresh_token: 'old-token' }) as any, res);
      expect(authService.logout).toHaveBeenCalledWith('u1', 'old-token', expect.any(String), expect.any(String));
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token', expect.any(Object));
    });

    it('efface quand même le cookie si pas de cookie (déjà expiré)', async () => {
      const res = mockRes();
      const user = { sub: 'u1', role: 'LECTEUR' } as any;
      await controller.logout(user, mockReq({}) as any, res);
      expect(authService.logout).not.toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalled();
    });
  });
});
