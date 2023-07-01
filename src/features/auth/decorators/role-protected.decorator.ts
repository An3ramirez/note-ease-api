import { RoleEnum } from '@features/user/enums/role.enum';
import { SetMetadata } from '@nestjs/common';

export const META_ROLES = 'roles';
export const RoleProtected = (...args: RoleEnum[]) => SetMetadata(META_ROLES, args);
