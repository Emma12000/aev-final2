import {
  Controller, Get, Query, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ActivityService } from './activity.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Activity')
@ApiBearerAuth('access-token')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activity: ActivityService) {}

  @Get('me')
  @ApiOperation({ summary: 'Mon historique d\'activité' })
  @ApiQuery({ name: 'page',  required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  myActivity(
    @CurrentUser() user: JwtPayload,
    @Query('page',  new DefaultValuePipe(1),  ParseIntPipe) page:  number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.activity.findByUser(user.sub, page, Math.min(limit, 100));
  }

  @Get()
  @Roles(Role.ADMINISTRATEUR, Role.SUPERVISEUR)
  @ApiOperation({ summary: 'Tous les logs d\'activité (admin/superviseur)' })
  @ApiQuery({ name: 'page',  required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('page',  new DefaultValuePipe(1),  ParseIntPipe) page:  number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.activity.findAll(page, Math.min(limit, 200));
  }
}
