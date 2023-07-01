import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { RoleEnum } from './enums/role.enum';
import { CreateUserWithPersonDto } from './dto/create-user-with-person.dto';
import { PersonEntity } from './entities/person.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(PersonEntity)
    private readonly personRepository: Repository<PersonEntity>,
    private dataSource: DataSource,
  ) {}

  async create(userData: CreateUserWithPersonDto): Promise<UserEntity> {
    const { name, lastname, email, username, password } = userData;
    const existingUser = await this.userRepository.findOneBy({ username });
    const existingPerson = await this.personRepository.findOneBy({ email });

    if (existingUser) {
      throw new BadRequestException(
        `User with username ${username} already exists`,
      );
    }

    if (existingPerson) {
      throw new BadRequestException(
        `Person with email ${email} already exists`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const personEntity: PersonEntity = this.personRepository.create({
        name,
        lastname,
        email,
      });
      const createdPerson = await queryRunner.manager.save(personEntity);

      const defaultRole: RoleEntity = await this.roleRepository.findOneBy({
        code: RoleEnum.NORMAL,
      });
      const userEntity: UserEntity = this.userRepository.create({
        username,
        password,
        person: createdPerson,
        role: defaultRole,
      });
      const createdUser = await queryRunner.manager.save(userEntity);

      await queryRunner.commitTransaction();
      return createdUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getById(userId: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id: userId });
  }

  async getByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ username });
  }

  async getByRefreshToken(refreshToken: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({
      hashed_refresh_token: refreshToken,
    });
  }

  async getByPasswordResetToken(
    passwordResetToken: string,
  ): Promise<UserEntity> {
    return this.userRepository.findOneBy({
      recovery_password_token: passwordResetToken,
    });
  }

  async updateLastLogin(userId: number) {
    return this.userRepository.update(userId, { last_login: new Date() });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    return this.userRepository.update(userId, {
      hashed_refresh_token: refreshToken,
    });
  }

  async updatePassword(userId: number, hashedPassword: string) {
    return this.userRepository.update(userId, { password: hashedPassword });
  }

  async savePasswordResetToken(userId: number, hashedToken: string) {
    return this.userRepository.update(userId, {
      recovery_password_token: hashedToken,
      recovery_password_token_created_at: new Date(),
    });
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, { hashed_refresh_token: null });
  }

  async removePasswordResetToken(userId: number) {
    return this.userRepository.update(userId, {
      recovery_password_token: null,
      recovery_password_token_created_at: null,
    });
  }
}
