import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "src/features/user/entities/user.entity";

@Entity('note')
export class NoteEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column({ nullable: true})
    last_edit?: Date;

    @Column({ default: false})
    pin_up?: boolean;

    @ManyToOne(() => UserEntity, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}