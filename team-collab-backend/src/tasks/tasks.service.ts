import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../database/db';
import { tasks, projects } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import { TaskStatus, CreateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  async createTask(data: CreateTaskDto, projectId: number, userId: number) {
    // Ensure project belongs to user
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

    if (!project.length) {
      throw new NotFoundException('Project not found');
    }

    const result = await db
      .insert(tasks)
      .values({
        title: data.title,
        description: data.description,
        status: data.status,
        projectId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      })
      .returning();

    return result[0];
  }

  async getTasks(
    projectId: number,
    userId: number,
    status?: TaskStatus,
    limit = 10,
    offset = 0,
  ) {
    // Ensure ownership
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

    if (!project.length) {
      throw new NotFoundException('Project not found');
    }

    const conditions = [eq(tasks.projectId, projectId)];

    if (status) {
      conditions.push(eq(tasks.status, status));
    }

    return db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);
  }

  async updateStatus(taskId: number, status: TaskStatus, userId: number) {
    // Step 1: Check ownership via join
    const task = await db
      .select()
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(tasks.id, taskId), eq(projects.userId, userId)));

    if (!task.length) {
      throw new NotFoundException('Task not found or not authorized');
    }

    const result = await db
      .update(tasks)
      .set({ status })
      .where(eq(tasks.id, taskId))
      .returning();

    return result[0];
  }

  async deleteTask(taskId: number, userId: number) {
    // Step 1: Check ownership
    const task = await db
      .select()
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(tasks.id, taskId), eq(projects.userId, userId)));

    if (!task.length) {
      throw new NotFoundException('Task not found or not authorized');
    }

    // Step 2: Delete
    await db.delete(tasks).where(eq(tasks.id, taskId));

    return { message: 'Task deleted successfully' };
  }
}
