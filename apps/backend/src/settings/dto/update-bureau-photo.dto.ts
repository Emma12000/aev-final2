import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBureauPhotoDto {
  @ApiProperty()
  @IsString()
  photoUrl: string;
}
