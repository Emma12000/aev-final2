import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../decorators/current-user.decorator';

// Hiérarchie des rôles : ADMINISTRATEUR > SUPERVISEUR > AGENT > CONSULTANT > LECTEUR
const ROLE_RANK: Record<Role, number> = {
  ADMINISTRATEUR: 5,
  SUPERVISEUR: 4,
  AGENT: 3,
  CONSULTANT: 2,
  LECTEUR: 1,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const userRank = ROLE_RANK[user?.role] ?? 0;
    const minRank = Math.min(...required.map((r) => ROLE_RANK[r]));

    if (userRank < minRank) {
      throw new ForbiddenException('Droits insuffisants pour cette action.');
    }
    return true;
  }
}
