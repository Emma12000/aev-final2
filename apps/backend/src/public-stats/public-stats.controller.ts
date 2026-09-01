import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';
import { QueryPublicStatsDto } from './dto/query-public-stats.dto';
import { PublicStatsService } from './public-stats.service';

@ApiTags('Statistiques publiques')
@Controller('public-stats')
export class PublicStatsController {
  constructor(private readonly stats: PublicStatsService) {}

  /**
   * Alimente le moteur de rendu vidéo (packages/motion) et tout affichage public.
   * N'expose QUE des agrégats calculés sur les documents PUBLIC : aucun titre,
   * aucun nom de fichier, aucun utilisateur, aucun journal d'activité.
   */
  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  @Get()
  @ApiOperation({
    summary: 'Agrégats publics de versement documentaire (documents PUBLIC uniquement)',
  })
  @ApiOkResponse({ description: 'Compteurs, répartition par catégorie, série mensuelle, top tags.' })
  get(@Query() query: QueryPublicStatsDto) {
    return this.stats.getPublicStats(query.period);
  }
}
