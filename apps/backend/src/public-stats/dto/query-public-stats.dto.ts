import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPublicStatsDto {
  @ApiPropertyOptional({
    description:
      "Période au format `YYYY` (année civile) ou `YYYY-Qn` (trimestre). Par défaut : le trimestre en cours.",
    example: '2026-Q1',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}(-Q[1-4])?$/, {
    message: 'period doit être au format YYYY ou YYYY-Qn (ex. 2026 ou 2026-Q1).',
  })
  period?: string;
}
