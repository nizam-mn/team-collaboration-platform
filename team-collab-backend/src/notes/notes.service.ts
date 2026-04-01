import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../database/db';
import { notes, projects } from '../database/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class NotesService {

  // ✅ Create Note
  async createNote(content: string, projectId: number, userId: number) {
    // Ensure project belongs to user
    const project = await db
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

    const result = await db
      .insert(notes)
      .values({
        content,
        projectId,
      })
      .returning();

    return result[0];
  }

  // ✅ Get Notes
  async getNotes(projectId: number, userId: number) {
    const project = await db
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

    return db
      .select()
      .from(notes)
      .where(eq(notes.projectId, projectId));
  }

  // 🔐 Update Note (with ownership check)
  async updateNote(noteId: number, content: string, userId: number) {
    const note = await db
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

    const result = await db
      .update(notes)
      .set({ content })
      .where(eq(notes.id, noteId))
      .returning();

    return result[0];
  }

  // 🔐 Delete Note
  async deleteNote(noteId: number, userId: number) {
    const note = await db
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

    await db.delete(notes).where(eq(notes.id, noteId));

    return { message: 'Note deleted successfully' };
  }
}