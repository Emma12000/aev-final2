import { Injectable } from '@nestjs/common';
import { Action, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const MAX_SESSION_MS = TWO_HOURS_MS; // cap sessions sans LOGOUT

interface LogParams {
  userId: string;
  action: Action;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: LogParams): Promise<void> {
    const { metadata, ...rest } = params;
    await this.prisma.activityLog
      .create({ data: { ...rest, metadata: metadata as Prisma.InputJsonValue } })
      .catch(() => undefined);
  }

  async findAll(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, fullName: true, email: true, role: true } } },
      }),
      this.prisma.activityLog.count(),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.activityLog.count({ where: { userId } }),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getUsersStats() {
    const [users, logs] = await Promise.all([
      this.prisma.user.findMany({
        select: { id: true, fullName: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true, photoUrl: true },
        orderBy: { fullName: 'asc' },
      }),
      this.prisma.activityLog.findMany({
        select: { userId: true, action: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // group logs by userId
    const byUser = new Map<string, { action: Action; createdAt: Date }[]>();
    for (const l of logs) {
      if (!byUser.has(l.userId)) byUser.set(l.userId, []);
      byUser.get(l.userId)!.push(l);
    }

    const now = Date.now();
    const twoHoursAgo = now - TWO_HOURS_MS;

    return users.map(user => {
      const userLogs = byUser.get(user.id) ?? [];
      let views = 0, downloads = 0, uploads = 0, totalMs = 0;
      let loginTime: number | null = null;
      let isOnline = false;
      let lastActivity: Date | null = null;

      for (const l of userLogs) {
        const t = l.createdAt.getTime();
        if (t > (lastActivity?.getTime() ?? 0)) lastActivity = l.createdAt;

        switch (l.action) {
          case 'DOCUMENT_VIEW':     views++;     break;
          case 'DOCUMENT_DOWNLOAD': downloads++; break;
          case 'DOCUMENT_UPLOAD':   uploads++;   break;
          case 'LOGIN':
            loginTime = t;
            break;
          case 'LOGOUT':
            if (loginTime !== null) {
              totalMs += t - loginTime;
              loginTime = null;
            }
            break;
        }
      }

      // session encore ouverte
      if (loginTime !== null) {
        if (loginTime >= twoHoursAgo) {
          isOnline = true;
          totalMs += now - loginTime;
        } else {
          totalMs += Math.min(now - loginTime, MAX_SESSION_MS);
        }
      }

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        photoUrl: user.photoUrl ?? null,
        isOnline,
        lastActivity,
        stats: { views, downloads, uploads, timeOnPlatformMs: Math.round(totalMs) },
      };
    });
  }
}
