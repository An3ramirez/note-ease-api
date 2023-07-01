import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '$2b$12$m4BTvh/KISCnlhlMmj3AiuwV9HJx5qT6cDyv4c6KH9bbYOcT3nIte',
  })
  token: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'changemeTwo*%' })
  password: string;
}
