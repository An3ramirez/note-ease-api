import { Exclude } from 'class-transformer';
import { Column, DeleteDateColumn } from 'typeorm';

export abstract class TimestampedEntity {
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
