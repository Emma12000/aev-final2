import {
  IsString, IsOptional, IsEnum, IsArray, IsUUID, MaxLength, MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Confidentiality } from '@prisma/client';

export class CreateDocumentDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ enum: Confidentiality, default: Confidentiality.INTERNE })
  @IsOptional()
  @IsEnum(Confidentiality)
  confidentiality?: Confidentiality;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
