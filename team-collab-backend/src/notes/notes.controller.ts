import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './notes.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post(':projectId')
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() body: CreateNoteDto,
    @Req() req,
  ) {
    return this.notesService.createNote(
      body.content,
      projectId,
      req.user.sub,
    );
  }

  @Get(':projectId')
  getAll(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Req() req,
  ) {
    return this.notesService.getNotes(
      projectId,
      req.user.sub,
    );
  }

  @Patch(':noteId')
  update(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Body() body: CreateNoteDto,
    @Req() req,
  ) {
    return this.notesService.updateNote(
      noteId,
      body.content,
      req.user.sub,
    );
  }

  @Delete(':noteId')
  delete(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Req() req,
  ) {
    return this.notesService.deleteNote(
      noteId,
      req.user.sub,
    );
  }
}