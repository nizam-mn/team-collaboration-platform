import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { DB_PROVIDER } from '../database/database.module';
import type { DatabaseType } from '../database/database.module';
import { notes, projects } from '../database/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class NotesService {
  constructor(@Inject(DB_PROVIDER) private db: DatabaseType) {}

  // ✅ Create Note
  async createNote(content: string, projectId: string, userId: string) {
    // Ensure project belongs to user
    const project = await this.db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.userId, userId),
        ),
      );

    if (!project.length) {
      throw new NotFoundException('Project not found');
    }

    const result = await this.db
      .insert(notes)
      .values({
        content,
        projectId,
      })
      .returning();

    return result[0];
  }

  // ✅ Get Notes
  async getNotes(projectId: string, userId: string) {
    const project = await this.db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.userId, userId),
        ),
      );

    if (!project.length) {
      throw new NotFoundException('Project not found');
    }

    return this.db
      .select()
      .from(notes)
      .where(eq(notes.projectId, projectId));
  }

  // 🔐 Update Note (with ownership check)
  async updateNote(noteId: string, content: string, userId: string) {
    const note = await this.db
      .select()
      .from(notes)
      .innerJoin(projects, eq(notes.projectId, projects.id))
      .where(
        and(
          eq(notes.id, noteId),
          eq(projects.userId, userId),
        ),
      );

    if (!note.length) {
      throw new NotFoundException('Note not found or not authorized');
    }

    const result = await this.db
      .update(notes)
      .set({ content })
      .where(eq(notes.id, noteId))
      .returning();

    return result[0];
  }

  // 🔐 Delete Note
  async deleteNote(noteId: string, userId: string) {
    const note = await this.db
      .select()
      .from(notes)
      .innerJoin(projects, eq(notes.projectId, projects.id))
      .where(
        and(
          eq(notes.id, noteId),
          eq(projects.userId, userId),
        ),
      );

    if (!note.length) {
      throw new NotFoundException('Note not found or not authorized');
    }

    await this.db.delete(notes).where(eq(notes.id, noteId));

    return { message: 'Note deleted successfully' };
  }
}
