import { Entity, Column, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampedEntity } from 'src/common/entities/timestamped.entity';

@Entity('person')
export class PersonEntity extends TimestampedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @BeforeInsert()
  async beforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
}
