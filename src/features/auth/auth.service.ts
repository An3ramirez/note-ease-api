import { UserEntity } from '@features/user/entities/user.entity';
import { UserService } from '@features/user/user.service';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtSignOptions } from '@nestjs/jwt/dist/interfaces';
import { SigninResponseDto } from './dto/signin-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserWithPersonDto } from '@features/user/dto/create-user-with-person.dto';

@Injectable()
export class AuthService {
  private readonly accessTokenOptions: JwtSignOptions;
  private readonly refreshTokenOptions: JwtSignOptions;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.accessTokenOptions = {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    };
    this.refreshTokenOptions = {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
    };
  }

  hashData(data: string) {
    const saltRounds = 12;
    return bcrypt.hash(data, saltRounds);
  }

  async validateUserForLocalStrategy(username: string, password: string) {
    const user: UserEntity = await this.userService.getByUsername(username);

    if (!user) {
      return null;
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (isPasswordMatching) {
      await this.userService.updateLastLogin(user.id);
      return user;
    }

    return null;
  }

  async validateUserIfRefreshTokenMatches(
    userId: number,
    refreshToken: string,
  ) {
    const user: UserEntity = await this.userService.getById(userId);

    if (!user || !user.hashed_refresh_token) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    return user;
  }

  async getTokens(userId: number): Promise<SigninResponseDto> {
    const payload: JwtPayload = { sub: userId };
    const accessToken: string = this.jwtService.sign(
      payload,
      this.accessTokenOptions,
    );
    const refreshToken: string = this.jwtService.sign(
      payload,
      this.refreshTokenOptions,
    );
    await this.updateRefreshToken(userId, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    return this.userService.updateRefreshToken(userId, hashedRefreshToken);
  }

  async changePassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;
    const user = await this.userService.getByPasswordResetToken(token);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el token es valido o ha expirado
    const isTokenValid = token === user.recovery_password_token;
    const tokenExpirationTime =
      user.recovery_password_token_created_at.getTime();
    const currentTime = Date.now();
    const expirationTimeMinutes = 5;
    const tokenExpirationDuration = expirationTimeMinutes * 60 * 1000;

    if (
      !isTokenValid ||
      currentTime > tokenExpirationTime + tokenExpirationDuration
    ) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const hashedPassword = await this.hashData(password);
    await this.userService.updatePassword(user.id, hashedPassword);
    await this.userService.removePasswordResetToken(user.id);

    return { message: 'Contraseña restablecida correctamente' };
  }

  async signUp(userData: CreateUserWithPersonDto) {
    const user = await this.userService.create(userData);
    return this.getTokens(user.id);
  }

  async logout(userId: number) {
    return this.userService.removeRefreshToken(userId);
  }
}
