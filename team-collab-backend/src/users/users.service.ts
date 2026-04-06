import { Injectable, Inject } from '@nestjs/common';
import { DB_PROVIDER } from '../database/database.module';
import type { DatabaseType } from '../database/database.module';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject(DB_PROVIDER) private db: DatabaseType) {}

  async findByEmail(email: string) {
    const result = await this.db.select().from(users).where(eq(users.email, email));

    return result[0];
  }

  async createUser(username: string, email: string, password: string) {
    const result = await this.db
      .insert(users)
      .values({ username, email, password })
      .returning();

    return result[0];
  }
}
