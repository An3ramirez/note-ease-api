import { ApiProperty } from '@nestjs/swagger';

export class SigninResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY4ODE2MjM5MiwiZXhwIjoxNjg4MTY1OTkyfQ.GpQfulWQrtJukeT-2QhjUwPylOTUYGo5w7Lr94ibX2o'})
  refresh_token: string;
}