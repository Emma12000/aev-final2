import {
  Controller, Get, Post, Delete, Body, Param, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role, Permission } from '@prisma/client';
import { IsUUID, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';
import { AccessService } from './access.service';

class GrantDocumentDto {
  @IsUUID() documentId: string;
  @IsUUID() userId: string;
  @IsEnum(Permission) @IsOptional() permission?: Permission;
  @IsDateString() @IsOptional() expiresAt?: string;
}

class GrantCategoryDto {
  @IsUUID() categoryId: string;
  @IsUUID() userId: string;
  @IsDateString() @IsOptional() expiresAt?: string;
}

@ApiTags('Access')
@ApiBearerAuth('access-token')
@Roles(Role.ADMINISTRATEUR, Role.SUPERVISEUR)
@Controller('access')
export class AccessController {
  constructor(private readonly access: AccessService) {}

  // ─── Document access ──────────────────────────────────────────────────────

  @Get('documents')
  @ApiOperation({ summary: 'Lister les règles d\'accès aux documents' })
  listDocumentRules() {
    return this.access.listDocumentRules();
  }

  @Post('documents')
  @ApiOperation({ summary: 'Accorder l\'accès à un document' })
  grantDocument(@Body() dto: GrantDocumentDto, @CurrentUser() actor: JwtPayload) {
    return this.access.grantDocument(dto, actor.sub);
  }

  @Delete('documents/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Révoquer l\'accès à un document' })
  revokeDocument(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: JwtPayload) {
    return this.access.revokeDocument(id, actor.sub);
  }

  // ─── Category access ──────────────────────────────────────────────────────

  @Get('categories')
  @ApiOperation({ summary: 'Lister les règles d\'accès aux catégories' })
  listCategoryRules() {
    return this.access.listCategoryRules();
  }

  @Post('categories')
  @ApiOperation({ summary: 'Accorder l\'accès à une catégorie' })
  grantCategory(@Body() dto: GrantCategoryDto, @CurrentUser() actor: JwtPayload) {
    return this.access.grantCategory(dto, actor.sub);
  }

  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Révoquer l\'accès à une catégorie' })
  revokeCategory(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: JwtPayload) {
    return this.access.revokeCategory(id, actor.sub);
  }
}
