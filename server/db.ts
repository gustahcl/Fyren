import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/schema';

// Verifica se a variável de ambiente DATABASE_URL está definida.
// Se não estiver, o programa é interrompido com um erro claro.
if (!process.env.DATABASE_URL) {
  throw new Error("A variável de ambiente DATABASE_URL não foi definida.");
}

// Cria um 'pool' de conexões com o PostgreSQL.
// Um pool é mais eficiente do que criar uma nova conexão para cada consulta.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Inicializa o Drizzle, ligando o pool de conexões ao seu schema.
// A variável 'db' será o seu cliente principal para interagir com a base de dados.
export const db = drizzle(pool, { schema });