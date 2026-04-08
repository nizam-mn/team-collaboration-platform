import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { DB_PROVIDER } from '../database/database.module';
import type { DatabaseType } from '../database/database.module';
import { tasks, projects } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import { TaskStatus, CreateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(@Inject(DB_PROVIDER) private db: DatabaseType) {}

  async createTask(data: CreateTaskDto, projectId: string, userId: string) {
    // Ensure project belongs to user
    const project = await this.db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));

    if (!project.length) {
      throw new NotFoundException('Project not found');
    }

    const result = await this.db
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
    projectId: string,
    userId: string,
    status?: TaskStatus,
    limit = 10,
    offset = 0,
  ) {
    // Ensure ownership
    const project = await this.db
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

    return this.db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);
  }

  async updateStatus(taskId: string, status: TaskStatus, userId: string) {
    // Step 1: Check ownership via join
    const task = await this.db
      .select()
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(tasks.id, taskId), eq(projects.userId, userId)));

    if (!task.length) {
      throw new NotFoundException('Task not found or not authorized');
    }

    const result = await this.db
      .update(tasks)
      .set({ status })
      .where(eq(tasks.id, taskId))
      .returning();

    return result[0];
  }

  async deleteTask(taskId: string, userId: string) {
    // Step 1: Check ownership
    const task = await this.db
      .select()
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(tasks.id, taskId), eq(projects.userId, userId)));

    if (!task.length) {
      throw new NotFoundException('Task not found or not authorized');
    }

    // Step 2: Delete
    await this.db.delete(tasks).where(eq(tasks.id, taskId));

    return { message: 'Task deleted successfully' };
  }
}
