import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { constAuthEstrategy } from '@features/constants';
@Injectable()
export class JwtRefreshGuard extends AuthGuard(constAuthEstrategy.jwtRefreshToken) {}
