import { Pool, QueryResult, QueryResultRow } from 'pg';

// Create a singleton database connection pool
const globalForDb = global as unknown as { dbPool: Pool };

// Ensure password is always a string (pg requires it for SCRAM auth)
const dbPassword = process.env.DB_PASSWORD;
const password = typeof dbPassword === 'string' ? dbPassword : '';

export const dbPool = globalForDb.dbPool || new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'eksicode',
  user: process.env.DB_USER || 'postgres',
  password,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbPool = dbPool;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await dbPool.end();
});

process.on('SIGINT', async () => {
  await dbPool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await dbPool.end();
  process.exit(0);
});

// Helper function to execute queries
export async function query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await dbPool.query<T>(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function for single row queries
export async function queryOne<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] || null;
}

// Helper function for multiple rows
export async function queryMany<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<T[]> {
  const result = await query<T>(text, params);
  return result.rows;
}
