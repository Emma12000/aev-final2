import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FacebookAuthDto {
  @ApiProperty()
  @IsString()
  accessToken: string;
}
