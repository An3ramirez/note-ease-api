import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
  Get,
  Res,
  Body,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignInDto } from './dto/signin.dto';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { CreateUserWithPersonDto } from 'src/features/user/dto/create-user-with-person.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('Authenticación')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: SignInDto })
  signIn(@Req() request: RequestWithUser) {
    return this.authService.getTokens(request.user.id);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Registro de usuario' })
  signUp(@Body() createUserData: CreateUserWithPersonDto) {
    return this.authService.signUp(createUserData);
  }

  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  @Get('refresh-token')
  @ApiBearerAuth('refresh-token')
  refreshTokens(@Req() request: RequestWithUser) {
    return this.authService.getTokens(request.user.id);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  @ApiOperation({ summary: 'Cerrar sesión' })
  async signOut(@Req() request: RequestWithUser, @Res() response: Response) {
    await this.authService.logout(request.user.id);
    response.sendStatus(200);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña' })
  @ApiOkResponse({ description: 'Contraseña restablecida correctamente' })
  @ApiBadRequestResponse({ description: 'Token inválido o expirado' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.changePassword(resetPasswordDto);
  }
}
