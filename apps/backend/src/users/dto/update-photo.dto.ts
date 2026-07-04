import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePhotoDto {
  @ApiProperty()
  @IsString()
  photoUrl: string;
}
