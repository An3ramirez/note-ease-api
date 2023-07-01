import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from '@features/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN'),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: userId } = payload;
    const user = await this.userService.getById(userId);

    if (!user) {
      return null
    }

    //{ "error": "invalid_token", "error_description": "The access token expired" }
    return user;
  }
}
