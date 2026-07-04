import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const BUREAU_IDS = ['anne_marie','tiandje','hadje','haoua','fatime','damba','nanmadji','clemence','nkouka','min_kitoko','odan'];

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
    return this.prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: photoUrl },
      update: { value: photoUrl },
      select: { key: true },
    });
  }
}
