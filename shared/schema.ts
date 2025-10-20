import { pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";

// Tabela para os perfis de utilizador (Admin, Chefe, Analista)
export const roles = pgTable("roles", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 50 }).notNull().unique(),
});

// Tabela de Utilizadores (Bombeiros)
export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: text("password").notNull(),
	rank: varchar("rank", { length: 50 }),
	roleId: integer("role_id").references(() => roles.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de Ocorrências
export const occurrences = pgTable("occurrences", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("Em Andamento").notNull(),
  description: text("description"),
  team: varchar("team", { length: 100 }),
  responsibleId: integer("responsible_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela para Mídia (fotos/vídeos)
export const media = pgTable("media", {
    id: serial("id").primaryKey(),
    occurrenceId: integer("occurrence_id").notNull().references(() => occurrences.id),
    type: varchar("type", { length: 50 }).notNull(), // 'foto' ou 'video'
    url: text("url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tipos para facilitar o uso no código
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Occurrence = typeof occurrences.$inferSelect;
export type InsertOccurrence = typeof occurrences.$inferInsert;