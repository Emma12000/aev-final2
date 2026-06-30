import {
  Controller, Post, Get, Patch, Body, Req, Res, Query, HttpCode, HttpStatus, UseGuards,
  BadRequestException, UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser, JwtPayload } from './decorators/current-user.decorator';

const REFRESH_COOKIE = 'refresh_token';
const REFRESH_COOKIE_PATH = '/api/v1/auth';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // Refresh token : httpOnly, jamais lisible/volable par du JS (cf. CDC sécurité)
  private setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: REFRESH_COOKIE_PATH,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie(REFRESH_COOKIE, { path: REFRESH_COOKIE_PATH });
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion — access token en réponse, refresh token en cookie httpOnly' })
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...rest } = await this.auth.login(dto, req.ip, req.headers['user-agent']);
    this.setRefreshCookie(res, refreshToken);
    return rest;
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Inscription (compte LECTEUR par défaut)' })
  async register(@Body() dto: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...rest } = await this.auth.register(dto, req.ip, req.headers['user-agent']);
    this.setRefreshCookie(res, refreshToken);
    return rest;
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renouveler l\'access token via le refresh token (cookie httpOnly)' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawToken = req.cookies?.[REFRESH_COOKIE];
    if (!rawToken) throw new UnauthorizedException('Refresh token manquant.');
    const { refreshToken, ...rest } = await this.auth.refresh(rawToken);
    this.setRefreshCookie(res, refreshToken);
    return rest;
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion / inscription via Google OAuth' })
  async googleAuth(@Body() dto: GoogleAuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...rest } = await this.auth.googleAuth(dto.idToken);
    this.setRefreshCookie(res, refreshToken);
    return rest;
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demander un lien de réinitialisation de mot de passe' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.auth.forgotPassword(dto.email);
    return { message: 'Si cet email est enregistré, vous recevrez un lien de réinitialisation.' };
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Réinitialiser le mot de passe via le token reçu par email' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.auth.resetPassword(dto.token, dto.newPassword);
    return { message: 'Mot de passe réinitialisé avec succès.' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Déconnexion — révoque le refresh token et efface le cookie' })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawToken = req.cookies?.[REFRESH_COOKIE];
    if (rawToken) {
      await this.auth.logout(user.sub, rawToken, req.ip, req.headers['user-agent']);
    }
    this.clearRefreshCookie(res);
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmer l\'adresse email via le token reçu' })
  async verifyEmail(@Query('token') token: string) {
    if (!token) throw new BadRequestException('Token manquant.');
    await this.auth.verifyEmail(token);
    return { message: 'Email vérifié avec succès.' };
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Renvoyer l\'email de vérification' })
  async resendVerification(@CurrentUser() user: JwtPayload) {
    await this.auth.resendVerification(user.sub);
    return { message: 'Email de vérification renvoyé.' };
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Profil de l\'utilisateur connecté' })
  me(@CurrentUser() user: JwtPayload) {
    return this.auth.getProfile(user.sub);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Mettre à jour son propre profil (nom)' })
  async updateProfile(@CurrentUser() user: JwtPayload, @Body() body: { fullName?: string }) {
    return this.auth.updateProfile(user.sub, body.fullName);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Changer son mot de passe' })
  async changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    await this.auth.changePassword(user.sub, body.oldPassword, body.newPassword);
    return { message: 'Mot de passe mis à jour avec succès.' };
  }
}
