import 'dotenv/config'; // Importa para carregar as variáveis de ambiente do ficheiro .env
import { defineConfig } from "drizzle-kit";

// Verifica se a DATABASE_URL foi carregada corretamente do .env
if (!process.env.DATABASE_URL) {
  throw new Error("A variável de ambiente DATABASE_URL não foi definida no seu ficheiro .env");
}

export default defineConfig({
  schema: "./shared/schema.ts", // Caminho para o ficheiro que define as suas tabelas
  out: "./migrations",           // Pasta onde os ficheiros de migração serão guardados
  dialect: "postgresql",         // O tipo de base de dados que está a usar
  dbCredentials: {
    url: process.env.DATABASE_URL, // Usa a URL da sua base de dados Neon
  },
});