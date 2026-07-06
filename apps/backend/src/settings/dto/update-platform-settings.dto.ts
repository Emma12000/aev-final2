import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlatformSettingsDto {
  @ApiPropertyOptional({ description: 'Approbation admin requise avant publication des dépôts' })
  @IsOptional()
  @IsBoolean()
  requireManualValidation?: boolean;

  @ApiPropertyOptional({ description: 'Les visiteurs non connectés peuvent télécharger les documents publics' })
  @IsOptional()
  @IsBoolean()
  allowPublicDownload?: boolean;

  @ApiPropertyOptional({ description: 'Envoi d\'un email à l\'admin à chaque nouveau dépôt' })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;
}
