import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SettingsService } from './settings.service';
import { UpdateBureauPhotoDto } from './dto/update-bureau-photo.dto';
import { UpdatePlatformSettingsDto } from './dto/update-platform-settings.dto';

const VALID_IDS = ['anne_marie','tiandje','hadje','haoua','fatime','damba','nanmadji','clemence','nkouka','min_kitoko','odan'];

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get('bureau-photos')
  @Public()
  @ApiOperation({ summary: 'Photos du bureau exécutif (public)' })
  getBureauPhotos() {
    return this.settings.getBureauPhotos();
  }

  @Patch('bureau-photo/:id')
  @Roles(Role.ADMINISTRATEUR, Role.SUPERVISEUR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mettre à jour la photo d\'un membre du bureau' })
  updateBureauPhoto(@Param('id') id: string, @Body() dto: UpdateBureauPhotoDto) {
    if (!VALID_IDS.includes(id)) throw new BadRequestException('Identifiant invalide.');
    if (!dto.photoUrl?.startsWith('data:image/')) throw new BadRequestException('Format invalide.');
    return this.settings.updateBureauPhoto(id, dto.photoUrl);
  }

  @Get('platform')
  @Roles(Role.ADMINISTRATEUR, Role.SUPERVISEUR)
  @ApiOperation({ summary: 'Lire les réglages de la plateforme' })
  getPlatformSettings() {
    return this.settings.getPlatformSettings();
  }

  @Patch('platform')
  @Roles(Role.ADMINISTRATEUR, Role.SUPERVISEUR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Modifier les réglages de la plateforme' })
  updatePlatformSettings(@Body() dto: UpdatePlatformSettingsDto) {
    return this.settings.updatePlatformSettings(dto);
  }
}
