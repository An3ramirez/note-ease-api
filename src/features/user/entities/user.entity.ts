import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { NoteEntity } from '@features/note/entities/note.entity';
import { PersonEntity } from './person.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ nullable: true })
  last_login?: Date;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  hashed_refresh_token?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  recovery_password_token?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true, type: 'timestamp' })
  recovery_password_token_created_at?: Date;

  @ManyToOne(() => RoleEntity, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @OneToOne(() => PersonEntity, { eager: true })
  @JoinColumn({ name: 'person_id' })
  person: PersonEntity;

  @BeforeInsert()
  async beforeInsert() {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
}
