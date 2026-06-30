import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'membre@espoiretvie.td' })
  @IsEmail()
  email: string;
}
