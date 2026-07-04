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
}
