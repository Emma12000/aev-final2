import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
  ) {}

  async findAll() {
    return this.prisma.documentCategory.findMany({
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      include: {
        children: { orderBy: [{ order: 'asc' }, { name: 'asc' }] },
        _count: { select: { documents: true } },
      },
      where: { parentId: null }, // uniquement les catégories racines
    });
  }

  async findOne(id: string) {
    const cat = await this.prisma.documentCategory.findUnique({
      where: { id },
      include: { children: true, _count: { select: { documents: true } } },
    });
    if (!cat) throw new NotFoundException('Catégorie introuvable.');
    return cat;
  }

  async create(dto: CreateCategoryDto, actorId: string) {
    const exists = await this.prisma.documentCategory.findUnique({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException('Ce slug est déjà utilisé.');

    const cat = await this.prisma.documentCategory.create({ data: dto });
    await this.activity.log({ userId: actorId, action: 'CATEGORY_CREATE', resourceType: 'category', resourceId: cat.id });
    return cat;
  }

  async update(id: string, dto: Partial<CreateCategoryDto>, actorId: string) {
    await this.findOne(id);
    if (dto.slug) {
      const conflict = await this.prisma.documentCategory.findFirst({ where: { slug: dto.slug, NOT: { id } } });
      if (conflict) throw new ConflictException('Ce slug est déjà utilisé.');
    }
    const cat = await this.prisma.documentCategory.update({ where: { id }, data: dto });
    await this.activity.log({ userId: actorId, action: 'CATEGORY_UPDATE', resourceType: 'category', resourceId: id });
    return cat;
  }

  async remove(id: string, actorId: string) {
    const cat = await this.findOne(id);
    if (cat._count.documents > 0) {
      throw new ConflictException('Impossible de supprimer une catégorie qui contient des documents.');
    }
    await this.prisma.documentCategory.delete({ where: { id } });
    await this.activity.log({ userId: actorId, action: 'CATEGORY_DELETE', resourceType: 'category', resourceId: id });
  }
}
