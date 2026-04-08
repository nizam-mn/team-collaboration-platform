import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { DB_PROVIDER } from '../database/database.module';
import type { DatabaseType } from '../database/database.module';
import { projects } from '../database/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class ProjectsService {
  constructor(@Inject(DB_PROVIDER) private db: DatabaseType) {}

  async createProject(name: string, userId: string) {
    const result = await this.db
      .insert(projects)
      .values({
        name,
        userId,
      })
      .returning();

    return result[0];
  }

  async getUserProjects(userId: string) {
    return this.db.select().from(projects).where(eq(projects.userId, userId));
  }

  async getProjectById(id: string, userId: string) {
  const project = await this.db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.id, id),
        eq(projects.userId, userId),
      ),
    );

  if (!project.length) {
    throw new NotFoundException("Project not found");
  }

  return project[0];
}

  async deleteProject(projectId: string, userId: string) {
    const result = await this.db
      .delete(projects)
      .where(
        and(
          eq(projects.id, projectId),
          eq(projects.userId, userId),
        ),
      )
      .returning();

    if (!result.length) {
      throw new NotFoundException('Project not found or not authorized');
    }

    return { message: 'Project deleted successfully' };
  }
}
