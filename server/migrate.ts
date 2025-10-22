import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import 'dotenv/config'; // Garante que as variáveis de ambiente sejam carregadas

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error("A variável de ambiente DATABASE_URL não foi definida.");
  }
  
  console.log("A iniciar a ligação à base de dados para migração...");

  // Cria uma ligação direta para a migração, sem usar o pool da aplicação
  const migrationClient = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(migrationClient);

  console.log("A executar migrações...");

runMigrations();