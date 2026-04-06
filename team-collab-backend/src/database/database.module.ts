import { Global, Module } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

export type DatabaseType = NodePgDatabase<typeof schema>;

export const DB_PROVIDER = 'DB_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: DB_PROVIDER,
      useFactory: () => {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DB_PROVIDER],
})
export class DatabaseModule {}
