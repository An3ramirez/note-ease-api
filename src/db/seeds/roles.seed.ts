import { RoleEntity } from '@features/user/entities/role.entity';
import { RoleEnum } from '@features/user/enums/role.enum';
import { DataSource } from 'typeorm';

export async function createRoles(datasource: DataSource) {
  return datasource
    .createQueryBuilder()
    .insert()
    .into(RoleEntity)
    .values([
      { name: RoleEnum.NORMAL, code: RoleEnum.NORMAL },
      { name: RoleEnum.PREMIUM, code: RoleEnum.PREMIUM },
    ])
    .orUpdate(['name'], ['code'], { skipUpdateIfNoValuesChanged: true })
    .execute();
}
