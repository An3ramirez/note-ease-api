import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRoleGuard } from '../guards/user-role.guard';
import { RoleProtected } from './role-protected.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleEnum } from '@features/user/enums/role.enum';

export function Auth(...roles: RoleEnum[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(JwtAuthGuard, UserRoleGuard),
  );
}
