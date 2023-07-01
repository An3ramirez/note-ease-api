import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from "express";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { AuthService } from "../auth.service";
import { constAuthEstrategy } from "../../constants";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, constAuthEstrategy.jwtRefreshToken) {

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      passReqToCallback: true,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromHeader('refresh-token'),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN'),
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const { sub: userId } = payload;
    const refreshToken = req?.get('refresh-token')?.trim() ?? null;
    if (!refreshToken) throw new ForbiddenException('Access Denied');
    return this.authService.validateUserIfRefreshTokenMatches(userId, refreshToken);
  }
}
