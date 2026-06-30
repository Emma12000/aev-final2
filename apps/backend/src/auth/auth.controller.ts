import {
  Controller, Post, Get, Body, Req, Query, HttpCode, HttpStatus, UseGuards, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser, JwtPayload } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion — retourne access + refresh tokens' })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.auth.login(dto, req.ip, req.headers['user-agent']);
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Inscription (compte LECTEUR par défaut)' })
  register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.auth.register(dto, req.ip, req.headers['user-agent']);
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renouveler les tokens via refresh token' })
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion / inscription via Google OAuth' })
  googleAuth(@Body() dto: GoogleAuthDto) {
    return this.auth.googleAuth(dto.idToken);
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
  @ApiOperation({ summary: 'Déconnexion — révoque le refresh token' })
  logout(@CurrentUser() user: JwtPayload, @Body() dto: RefreshDto, @Req() req: Request) {
    return this.auth.logout(user.sub, dto.refreshToken, req.ip, req.headers['user-agent']);
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
}
