import postgres from 'postgres';
import dotenv from 'dotenv';

// Cargar variables desde el Secret File de Render si existe
dotenv.config({ path: '/etc/secrets/.env' });

// Como fallback, cargar .env local (cuando corres en tu PC)
dotenv.config();

const connectionString = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error(
    'Missing DATABASE_URL or SUPABASE_DB_URL in environment variables.'
  );
}

const sslRequired = (process.env.DB_SSL ?? 'true').toLowerCase() === 'true';

const sql = postgres(connectionString, {
  ssl: sslRequired ? 'require' : undefined,
  max: Number(process.env.DB_POOL_MAX ?? 10),
  idle_timeout: Number(process.env.DB_IDLE_TIMEOUT ?? 30),
  connect_timeout: Number(process.env.DB_CONNECT_TIMEOUT ?? 30),
});

const testConnection = async () => {
  try {
    await sql`select 1`;
    console.log('Conexión a Postgres establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    throw error;
  }
};

export { sql, testConnection };
import bcrypt from "bcryptjs";
