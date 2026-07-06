import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const BUREAU_IDS = ['anne_marie','tiandje','hadje','haoua','fatime','damba','nanmadji','clemence','nkouka','min_kitoko','odan'];

// Mot distinctif de chaque membre pour retrouver son compte utilisateur
const BUREAU_KEYWORD: Record<string, string> = {
  anne_marie: 'halina',
  tiandje:    'tiandje',
  hadje:      'damnalet',
  haoua:      'dassidi',
  fatime:     'patcha',
  damba:      'dyssou',
  nanmadji:   'nanmadji',
  clemence:   'mbakoyo',
  nkouka:     'nkouka',
  min_kitoko: 'kitoko',
  odan:       'debsikreo',
};

// Réglages de plateforme stockés dans SiteSetting (clé/valeur).
// Défaut = true pour les trois → reproduit le comportement actuel de la plateforme.
const PLATFORM_KEYS = {
  requireManualValidation: 'platform_require_manual_validation',
  allowPublicDownload:     'platform_allow_public_download',
  emailNotifications:      'platform_email_notifications',
} as const;

export interface PlatformSettings {
  requireManualValidation: boolean;
  allowPublicDownload: boolean;
  emailNotifications: boolean;
}

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBureauPhotos(): Promise<Record<string, string>> {
    const rows = await this.prisma.siteSetting.findMany({
      where: { key: { in: BUREAU_IDS.map(id => `bureau_photo_${id}`) } },
    });
    const result: Record<string, string> = {};
    for (const row of rows) {
      result[row.key.replace('bureau_photo_', '')] = row.value;
    }
    return result;
  }

  async updateBureauPhoto(id: string, photoUrl: string) {
    const key = `bureau_photo_${id}`;

    // Synchronise avec le photoUrl du compte utilisateur correspondant
    const keyword = BUREAU_KEYWORD[id];
    if (keyword) {
      const user = await this.prisma.user.findFirst({
        where: { fullName: { contains: keyword, mode: 'insensitive' } },
        select: { id: true },
      });
      if (user) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { photoUrl },
        });
      }
    }

    return this.prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: photoUrl },
      update: { value: photoUrl },
      select: { key: true },
    });
  }

  // ─── Réglages de plateforme ────────────────────────────────────────────────

  async getPlatformSettings(): Promise<PlatformSettings> {
    const keys = Object.values(PLATFORM_KEYS);
    const rows = await this.prisma.siteSetting.findMany({ where: { key: { in: keys } } });
    const values = new Map(rows.map((r) => [r.key, r.value]));
    // Absent → true (comportement historique de la plateforme)
    const bool = (key: string) => (values.has(key) ? values.get(key) === 'true' : true);
    return {
      requireManualValidation: bool(PLATFORM_KEYS.requireManualValidation),
      allowPublicDownload:     bool(PLATFORM_KEYS.allowPublicDownload),
      emailNotifications:      bool(PLATFORM_KEYS.emailNotifications),
    };
  }

  async updatePlatformSettings(dto: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const updates: Array<[string, boolean]> = [];
    if (dto.requireManualValidation !== undefined) updates.push([PLATFORM_KEYS.requireManualValidation, dto.requireManualValidation]);
    if (dto.allowPublicDownload     !== undefined) updates.push([PLATFORM_KEYS.allowPublicDownload,     dto.allowPublicDownload]);
    if (dto.emailNotifications      !== undefined) updates.push([PLATFORM_KEYS.emailNotifications,      dto.emailNotifications]);

    await Promise.all(
      updates.map(([key, value]) =>
        this.prisma.siteSetting.upsert({
          where: { key },
          create: { key, value: String(value) },
          update: { value: String(value) },
        }),
      ),
    );

    return this.getPlatformSettings();
  }
}
