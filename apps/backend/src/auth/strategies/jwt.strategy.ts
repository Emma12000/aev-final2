import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const publicKey = config.get<string>('jwt.publicKey');
    const secret = config.get<string>('jwt.secret') || '';
    const secretOrKey = publicKey || secret;
    if (!secretOrKey) {
      throw new Error('Configuration JWT manquante : définir JWT_PUBLIC_KEY (RS256) ou JWT_SECRET (HS256).');
    }
    const algorithms: ('RS256' | 'HS256')[] = publicKey ? ['RS256'] : ['HS256'];

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
      algorithms,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) throw new UnauthorizedException('Compte inactif ou introuvable.');
    return { sub: user.id, email: user.email, role: user.role };
  }
}
