import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        document: {
          select: {
            id: true, title: true, description: true,
            fileMimeType: true, fileSize: true,
            confidentiality: true, status: true,
            createdAt: true,
            category: { select: { id: true, name: true, slug: true, icon: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(userId: string, documentId: string) {
    const doc = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) throw new NotFoundException('Document introuvable.');

    const exists = await this.prisma.favorite.findUnique({
      where: { userId_documentId: { userId, documentId } },
    });
    if (exists) throw new ConflictException('Déjà dans les favoris.');

    return this.prisma.favorite.create({ data: { userId, documentId } });
  }

  async remove(userId: string, documentId: string) {
    const fav = await this.prisma.favorite.findUnique({
      where: { userId_documentId: { userId, documentId } },
    });
    if (!fav) throw new NotFoundException('Favori introuvable.');
    await this.prisma.favorite.delete({ where: { id: fav.id } });
  }
}
