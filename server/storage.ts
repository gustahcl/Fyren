import { type User, type InsertUser, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

// A interface (contrato) que define como interagimos com os dados dos utilizadores.
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>; // Alterado de getUserByUsername
  createUser(user: InsertUser): Promise<User>;
}

// A implementação real da lógica de acesso à base de dados usando Drizzle.
export class DrizzleStorage implements IStorage {
  // Busca um utilizador pelo seu ID numérico.
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  // Busca um utilizador pelo seu email (corrigido).
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)); // Alterado de users.username
    return result[0];
  }

  // Insere um novo utilizador na base de dados.
  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
}

// Exporta uma única instância da classe para ser usada em toda a aplicação.
export const storage = new DrizzleStorage();