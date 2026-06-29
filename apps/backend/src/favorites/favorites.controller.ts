import {
  Controller, Get, Post, Delete, Param, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Favorites')
@ApiBearerAuth('access-token')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Mes documents favoris' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.favorites.findByUser(user.sub);
  }

  @Post(':documentId')
  @ApiOperation({ summary: 'Ajouter un document aux favoris' })
  add(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.favorites.add(user.sub, documentId);
  }

  @Delete(':documentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Retirer un document des favoris' })
  remove(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.favorites.remove(user.sub, documentId);
  }
}
