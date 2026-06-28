import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SELECT_USER = {
  id: true, email: true, fullName: true, role: true,
  isActive: true, createdAt: true, lastLoginAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
  ) {}

  async findAll(page = 1, limit = 20, role?: Role) {
    const skip = (page - 1) * limit;
    const where = role ? { role } : {};
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: SELECT_USER }),
      this.prisma.user.count({ where }),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: SELECT_USER });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    return user;
  }

  async create(dto: CreateUserDto, actorId: string) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (exists) throw new ConflictException('Un compte existe déjà avec cet email.');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { email: dto.email.toLowerCase(), fullName: dto.fullName, passwordHash, role: dto.role ?? Role.LECTEUR },
      select: SELECT_USER,
    });

    await this.activity.log({ userId: actorId, action: 'USER_CREATE', resourceType: 'user', resourceId: user.id });
    return user;
  }

  async update(id: string, dto: UpdateUserDto, actorId: string) {
    await this.findOne(id);
    const user = await this.prisma.user.update({ where: { id }, data: dto, select: SELECT_USER });
    await this.activity.log({ userId: actorId, action: 'USER_UPDATE', resourceType: 'user', resourceId: id });
    return user;
  }

  async remove(id: string, actorId: string) {
    await this.findOne(id);
    // Soft delete : désactiver plutôt que supprimer
    await this.prisma.user.update({ where: { id }, data: { isActive: false } });
    await this.activity.log({ userId: actorId, action: 'USER_DELETE', resourceType: 'user', resourceId: id });
  }

  async stats() {
    const [total, byRole] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
    ]);
    return { total, byRole: byRole.map((r: { role: Role; _count: { id: number } }) => ({ role: r.role, count: r._count.id })) };
  }
}
