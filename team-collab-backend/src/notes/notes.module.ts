import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
imports: [AuthModule],
  controllers: [NotesController],
  providers: [NotesService]
})
export class NotesModule {}
