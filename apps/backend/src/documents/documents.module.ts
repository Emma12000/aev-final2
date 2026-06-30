import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { StorageService } from './storage.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [DocumentsService, StorageService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
