import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from "./entities/note.entity";

@Module({
    imports: [TypeOrmModule.forFeature([NoteEntity])],
    exports: [TypeOrmModule]
})
export class NoteModule {}
