import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from "@nestjs/core";
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators';
import { RequestWithUser } from '../interfaces/request-with-user.interface';
import { UserEntity } from '@features/user/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector
      .getAllAndOverride(META_ROLES, [context.getHandler(), context.getClass()]);

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user: UserEntity = request.user;
    return validRoles.includes(user.role?.code);
  }
}
