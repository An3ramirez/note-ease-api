import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { UserController } from './user.controller';
import { PersonEntity } from './entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity, UserEntity, RoleEntity])],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
  controllers: [UserController],
})
export class UserModule {}
