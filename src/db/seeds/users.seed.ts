import { PersonEntity } from '@features/user/entities/person.entity';
import { RoleEntity } from '@features/user/entities/role.entity';
import { UserEntity } from '@features/user/entities/user.entity';
import { RoleEnum } from '@features/user/enums/role.enum';
import { DataSource } from 'typeorm';

export async function createUsers(datasource: DataSource) {
  const userRepository = datasource.getRepository(UserEntity);
  const personRepository = datasource.getRepository(PersonEntity);
  const roleRepository = datasource.getRepository(RoleEntity);

  const roleNormal = await roleRepository.findOne({
    where: { code: RoleEnum.NORMAL },
  });
  const rolePremium = await roleRepository.findOne({
    where: { code: RoleEnum.PREMIUM },
  });

  const users = [
    {
      username: 'an3Ramirez',
      password: '$2b$08$vNOW6vaqfRO6qy6Q4QR8I.DfWHqWnUyhCudEJQ22AGzLc0Br7Ts2y', // changeme123
      role: roleNormal,
    },
    {
      username: 'corposoft',
      password: '$2b$08$vNOW6vaqfRO6qy6Q4QR8I.DfWHqWnUyhCudEJQ22AGzLc0Br7Ts2y', // changeme123
      role: rolePremium,
    },
  ];
  const savedUsers: UserEntity[] = [];

  for (const user of users) {
    const existingUser = await userRepository.findOne({
      where: { username: user.username },
    });

    if (!existingUser) {
      const savedUser = await userRepository.save(user);
      savedUsers.push(savedUser);
    }
  }

  return savedUsers;
}
