import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// Lazy database connection - only initialized when actually used
let sql = null;

function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

export { getDb as sql };
