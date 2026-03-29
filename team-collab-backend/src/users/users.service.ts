import { Injectable } from '@nestjs/common';
import { db } from '../database/db';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));

    return result[0];
  }

  async createUser(email: string, password: string) {
    const result = await db
      .insert(users)
      .values({ email, password })
      .returning();

    return result[0];
  }
}
