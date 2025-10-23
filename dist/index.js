var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcryptjs";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  media: () => media,
  occurrences: () => occurrences,
  roles: () => roles,
  users: () => users
});
import { pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
var roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique()
});
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  rank: varchar("rank", { length: 50 }),
  roleId: integer("role_id").references(() => roles.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var occurrences = pgTable("occurrences", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("Em Andamento").notNull(),
  description: text("description"),
  team: varchar("team", { length: 100 }),
  responsibleId: integer("responsible_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var media = pgTable("media", {
  id: serial("id").primaryKey(),
  occurrenceId: integer("occurrence_id").notNull().references(() => occurrences.id),
  type: varchar("type", { length: 50 }).notNull(),
  // 'foto' ou 'video'
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// server/storage.ts
import { eq } from "drizzle-orm";

// server/db.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
if (!process.env.DATABASE_URL) {
  throw new Error("A vari\xE1vel de ambiente DATABASE_URL n\xE3o foi definida.");
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
var DrizzleStorage = class {
  // Busca um utilizador pelo seu ID numérico.
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  // Busca um utilizador pelo seu email (corrigido).
  async getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
  // Insere um novo utilizador na base de dados.
  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
};
var storage = new DrizzleStorage();

// server/routes.ts
import { eq as eq2, count, desc } from "drizzle-orm";
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Acesso n\xE3o autorizado." });
}
async function registerRoutes(app2) {
  const PgStore = connectPgSimple(session);
  const sessionStore = new PgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true
  });
  app2.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "uma-chave-secreta-muito-forte-para-desenvolvimento",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1e3 }
    // Sessão dura 30 dias
  }));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "Email n\xE3o encontrado." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Senha incorreta." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  app2.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.json({ message: "Login bem-sucedido", user: userWithoutPassword });
  });
  app2.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logout bem-sucedido" });
      });
    });
  });
  app2.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated() && req.user) {
      const { password, ...userWithoutPassword } = req.user;
      res.json({ isAuthenticated: true, user: userWithoutPassword });
    } else {
      res.json({ isAuthenticated: false, user: null });
    }
  });
  app2.get("/api/occurrences", isAuthenticated, async (req, res) => {
    const result = await db.execute("SELECT * FROM vw_detailed_occurrences ORDER BY created_at DESC;");
    res.json(result.rows);
  });
  app2.post("/api/occurrences", isAuthenticated, async (req, res) => {
    const user = req.user;
    const newOccurrenceData = { ...req.body, responsibleId: user.id };
    const newOccurrence = await db.insert(occurrences).values(newOccurrenceData).returning();
    res.status(201).json(newOccurrence[0]);
  });
  app2.put("/api/occurrences/:id/status", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await db.update(occurrences).set({ status }).where(eq2(occurrences.id, Number(id))).returning();
    if (updated.length === 0) {
      return res.status(404).json({ message: "Ocorr\xEAncia n\xE3o encontrada." });
    }
    res.json(updated[0]);
  });
  app2.get("/api/stats", isAuthenticated, async (req, res) => {
    try {
      const totalResult = await db.select({ value: count() }).from(occurrences);
      const inProgressResult = await db.select({ value: count() }).from(occurrences).where(eq2(occurrences.status, "Em Andamento"));
      const completedResult = await db.select({ value: count() }).from(occurrences).where(eq2(occurrences.status, "Conclu\xEDdo"));
      const mostCommonResult = await db.select({
        type: occurrences.type,
        count: count(occurrences.type)
      }).from(occurrences).groupBy(occurrences.type).orderBy(desc(count(occurrences.type))).limit(1);
      res.json({
        totalOccurrences: totalResult[0]?.value || 0,
        inProgressOccurrences: inProgressResult[0]?.value || 0,
        completedOccurrences: completedResult[0]?.value || 0,
        mostCommonType: mostCommonResult.length > 0 ? mostCommonResult[0].type : "N/A"
      });
    } catch (error) {
      console.error("Erro ao buscar estat\xEDsticas:", error);
      res.status(500).json({ message: "Erro interno do servidor ao buscar estat\xEDsticas." });
    }
  });
  return app2;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server: void 0 },
    // ← remova a referência ao server
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        process.cwd(),
        "client",
        "index.html"
      );
      console.log("Tentando carregar:", clientTemplate);
      if (!fs.existsSync(clientTemplate)) {
        console.error("Arquivo nao encontrado:", clientTemplate);
        return res.status(404).send("index.html nao encontrado");
      }
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import "dotenv/config";
import path3 from "path";
console.log("Iniciando servidor...");
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(express2.static(path3.join(process.cwd(), "client")));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      const logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Erro Interno do Servidor";
      res.status(status).json({ message });
    });
    if (process.env.NODE_ENV === "development") {
      await setupVite(app);
    } else {
      serveStatic(app);
    }
    const port = 5173;
    const httpServer = app.listen(port, "localhost", () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
})();
