import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
  UploadedFile, UseInterceptors, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 Mo

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Recherche et liste des documents' })
  findAll(@Query() query: QueryDocumentsDto, @CurrentUser() actor: JwtPayload) {
    return this.docs.findAll(query, actor);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un document' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: JwtPayload) {
    return this.docs.findOne(id, actor);
  }

  @Get(':id/download')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtenir un lien signé pour télécharger le fichier' })
  download(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: JwtPayload) {
    return this.docs.getDownloadUrl(id, actor);
  }

  @Post('upload')
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        categoryId: { type: 'string' },
        confidentiality: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: MAX_SIZE_BYTES } }))
  @ApiOperation({ summary: 'Déposer un document' })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
    @CurrentUser() actor: JwtPayload,
  ) {
    return this.docs.upload(file, dto, actor);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Modifier les métadonnées d\'un document' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateDocumentDto>,
    @CurrentUser() actor: JwtPayload,
  ) {
    return this.docs.update(id, dto, actor);
  }

  @Post(':id/approve')
  @Roles(Role.ADMINISTRATEUR, Role.SUPERVISEUR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Approuver un document en attente' })
  approve(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: JwtPayload) {
    return this.docs.approve(id, actor);
  }

  @Post(':id/reject')
  @Roles(Role.ADMINISTRATEUR, Role.SUPERVISEUR)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Rejeter un document en attente' })
  reject(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: JwtPayload) {
    return this.docs.reject(id, actor);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un document (soft delete)' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: JwtPayload) {
    return this.docs.remove(id, actor);
  }
}
