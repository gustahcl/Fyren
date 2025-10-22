import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import 'dotenv/config';

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error("A variavel de ambiente DATABASE_URL nao foi definida.");
  }
  
  console.log("A iniciar a ligacao a base de dados para migracao...");

  const migrationClient = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(migrationClient);

  console.log("A executar migracoes...");

  try {
    await migrate(db, { migrationsFolder: './migrations' });
    console.log("Migracoes aplicadas com sucesso!");
  } catch (error) {
    console.error("Erro ao aplicar migracoes:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
    console.log("Ligacao de migracao fechada.");
    process.exit(0);
  }
}

console.log("A executar migracoes...");
runMigrations().catch(console.error);