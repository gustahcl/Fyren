-- Apaga as tabelas antigas se existirem, para garantir uma configuração limpa.
DROP VIEW IF EXISTS "vw_detailed_occurrences";
DROP TABLE IF EXISTS "media";
DROP TABLE IF EXISTS "occurrences";
DROP TABLE IF EXISTS "users";
DROP TABLE IF EXISTS "roles";

-- Tabela para os perfis de utilizador (Admin, Chefe, Analista)
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);

-- Tabela de Utilizadores (Bombeiros)
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL, -- A palavra-passe será um hash bcrypt
	"rank" varchar(50), -- Patente: Soldado, Cabo, etc.
	"role_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Tabela de Ocorrências
CREATE TABLE IF NOT EXISTS "occurrences" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(100) NOT NULL, -- Tipo: Incêndio, Resgate, etc.
	"region" varchar(100) NOT NULL, -- Região: Metropolitana, Agreste, etc.
	"status" varchar(50) DEFAULT 'Em Andamento' NOT NULL,
	"description" text,
	"team" varchar(100), -- Equipa designada
	"responsible_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Tabela para Mídia (fotos/vídeos) associados a uma ocorrência
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"occurrence_id" integer NOT NULL,
	"type" varchar(50) NOT NULL, -- 'foto' ou 'video'
	"url" text NOT NULL, -- URL do ficheiro guardado
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Adiciona as chaves estrangeiras (relações entre as tabelas)
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_responsible_id_users_id_fk" FOREIGN KEY ("responsible_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_occurrence_id_occurrences_id_fk" FOREIGN KEY ("occurrence_id") REFERENCES "public"."occurrences"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


-- Cria uma VIEW para simplificar a consulta de ocorrências com detalhes do responsável
CREATE OR REPLACE VIEW "vw_detailed_occurrences" AS
 SELECT o.id,
    o.type,
    o.region,
    o.status,
    o.description,
    o.team,
    o.created_at,
    u.name AS responsible_name,
    u.rank AS responsible_rank
   FROM occurrences o
     LEFT JOIN users u ON o.responsible_id = u.id;

-- =================================================================
-- INSERÇÃO DE DADOS INICIAIS
-- =================================================================

-- Insere os perfis de utilizador
INSERT INTO "roles" ("name") VALUES ('admin'), ('chefe'), ('analista') ON CONFLICT DO NOTHING;

-- Insere os utilizadores de teste com a palavra-passe 'admin122' já criptografada com bcrypt
-- A password hash é para 'admin123'
INSERT INTO "users" ("name", "email", "password", "rank", "role_id") VALUES
('Administrador do Sistema', 'admin@cbmpe.gov.br', 'admin123', 'Major', (SELECT id from roles WHERE name = 'admin')),
('Chefe de Operações', 'chefe@cbmpe.gov.br', 'chefe123', 'Capitão', (SELECT id from roles WHERE name = 'chefe')),
('Analista de Dados', 'analista@cbmpe.gov.br', 'analista123', 'Tenente', (SELECT id from roles WHERE name = 'analista'))
ON CONFLICT (email) DO NOTHING;

-- Insere algumas ocorrências de exemplo
INSERT INTO "occurrences" ("type", "region", "status", "description", "team", "responsible_id") VALUES
('Incêndio', 'Metropolitana', 'Em Andamento', 'Incêndio em residência no bairro de Boa Viagem.', 'Equipa Alpha', (SELECT id from users WHERE email = 'chefe@cbmpe.gov.br')),
('Resgate', 'Zona da Mata', 'Concluído', 'Resgate de animal preso em árvore.', 'Equipa Bravo', (SELECT id from users WHERE email = 'chefe@cbmpe.gov.br')),
('Vazamento', 'Agreste', 'Em Andamento', 'Vazamento de gás em área industrial.', 'Equipa Charlie', (SELECT id from users WHERE email = 'chefe@cbmpe.gov.br'))
ON CONFLICT (id) DO NOTHING;

UPDATE users
SET password = 'admin123'
WHERE email = 'admin@cbmpe.gov.br';