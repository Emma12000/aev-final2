import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly cats: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste des catégories (public)' })
  findAll() {
    return this.cats.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'une catégorie' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cats.findOne(id);
  }

  @Post()
  @Roles(Role.ADMINISTRATEUR, Role.SUPERVISEUR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Créer une catégorie' })
  create(@Body() dto: CreateCategoryDto, @CurrentUser() actor: JwtPayload) {
    return this.cats.create(dto, actor.sub);
  }

  @Patch(':id')
  @Roles(Role.ADMINISTRATEUR, Role.SUPERVISEUR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Modifier une catégorie' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateCategoryDto>,
    @CurrentUser() actor: JwtPayload,
  ) {
    return this.cats.update(id, dto, actor.sub);
  }

  @Delete(':id')
  @Roles(Role.ADMINISTRATEUR)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une catégorie (vide)' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: JwtPayload) {
    return this.cats.remove(id, actor.sub);
  }
}
