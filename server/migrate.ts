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

  try {
    // A função migrate procura por ficheiros na pasta 'migrations' (configurada no drizzle.config.ts)
    await migrate(db, { migrationsFolder: './migrations' });
    console.log("Migrações aplicadas com sucesso!");
  } catch (error) {
    console.error("Erro ao aplicar migrações:", error);
    process.exit(1);
  } finally {
    // Fecha a ligação após a conclusão
    await migrationClient.end();
    console.log("Ligação de migração fechada.");
    process.exit(0);
  }
}

runMigrations();