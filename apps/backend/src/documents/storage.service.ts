import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly supabase: SupabaseClient | null;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    const url = config.get<string>('supabase.url') ?? '';
    const key = config.get<string>('supabase.serviceKey') ?? '';
    this.supabase = url && key ? createClient(url, key) : null;
    this.bucket = config.get<string>('supabase.bucket') ?? 'aev-documents';
    if (!this.supabase) {
      this.logger.warn('Supabase non configuré — upload/download désactivés.');
    }
  }

  private get client(): SupabaseClient {
    if (!this.supabase) {
      throw new InternalServerErrorException('Stockage non configuré. Contactez l\'administrateur.');
    }
    return this.supabase;
  }

  async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ fileKey: string; fileName: string; fileMimeType: string; fileSize: number }> {
    const ext = path.extname(file.originalname).toLowerCase();
    const fileKey = `${folder}/${uuidv4()}${ext}`;

    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(fileKey, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      this.logger.error(`Erreur upload Supabase : ${error.message}`);
      throw new InternalServerErrorException('Échec du stockage du fichier.');
    }

    return {
      fileKey,
      fileName: file.originalname,
      fileMimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  async getSignedUrl(fileKey: string, expiresIn = 3600): Promise<string> {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(fileKey, expiresIn);

    if (error || !data?.signedUrl) {
      throw new InternalServerErrorException('Impossible de générer le lien de téléchargement.');
    }
    return data.signedUrl;
  }

  async delete(fileKey: string): Promise<void> {
    const { error } = await this.client.storage.from(this.bucket).remove([fileKey]);
    if (error) {
      this.logger.warn(`Erreur suppression fichier ${fileKey} : ${error.message}`);
    }
  }
}
