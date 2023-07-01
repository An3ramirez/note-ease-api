import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from './enums/role.enum';
import { Auth } from '@features/auth/decorators';
import { RequestWithUser } from '@features/auth/interfaces/request-with-user.interface';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@features/auth/guards/jwt-auth.guard';

@Controller('user')
@ApiTags('Usuario')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Informacion del usuario' })
  getProfile(@Req() request: RequestWithUser) {
    return this.userService.getById(request.user.id);
  }
}
