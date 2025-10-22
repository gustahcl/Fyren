import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcryptjs"; // A importação deve funcionar agora

import { storage } from "./storage"; // A importação de "./storage" está correta
import { db } from "./db";
import { occurrences, type User, roles } from "@shared/schema";
import { eq, count, desc } from "drizzle-orm";

// Middleware para verificar se o usuário está autenticado
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Acesso não autorizado." });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // --- Configuração de Sessão e Autenticação ---
  const PgStore = connectPgSimple(session);
  const sessionStore = new PgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
  });

  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'uma-chave-secreta-muito-forte-para-desenvolvimento',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // Sessão dura 30 dias
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Configuração da estratégia de login local do Passport
  passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Email não encontrado.' });
        }
        
        // Usar bcrypt.compare para comparar a senha de forma segura
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
          return done(null, false, { message: 'Senha incorreta.' });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  // Salva o ID do usuário na sessão
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Busca o usuário no banco de dados a partir do ID salvo na sessão
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // --- ROTAS DA API ---

  // Rota de Login
  app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    const { password, ...userWithoutPassword } = req.user as any;
    res.json({ message: "Login bem-sucedido", user: userWithoutPassword });
  });

  // Rota de Logout
  app.post('/api/auth/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json({ message: "Logout bem-sucedido" });
      });
    });
  });

  // Rota para verificar o status da sessão
  app.get('/api/auth/status', (req, res) => {
    if (req.isAuthenticated() && req.user) {
      const { password, ...userWithoutPassword } = req.user as any;
      res.json({ isAuthenticated: true, user: userWithoutPassword });
    } else {
      res.json({ isAuthenticated: false, user: null });
    }
  });

  // --- Rotas de Ocorrências (CRUD) ---

  app.get('/api/occurrences', isAuthenticated, async (req, res) => {
    const result = await db.execute("SELECT * FROM vw_detailed_occurrences ORDER BY created_at DESC;");
    res.json(result.rows);
  });
  
  app.post('/api/occurrences', isAuthenticated, async (req, res) => {
    const user = req.user as User;
    const newOccurrenceData = { ...req.body, responsibleId: user.id };
    
    const newOccurrence = await db.insert(occurrences).values(newOccurrenceData).returning();
    res.status(201).json(newOccurrence[0]);
  });
  
  app.put('/api/occurrences/:id/status', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const updated = await db.update(occurrences)
      .set({ status: status })
      .where(eq(occurrences.id, Number(id)))
      .returning();
      
    if (updated.length === 0) {
      return res.status(404).json({ message: "Ocorrência não encontrada." });
    }
    res.json(updated[0]);
  });

  // --- Rota para Estatísticas do Dashboard ---

  app.get('/api/stats', isAuthenticated, async (req, res) => {
    try {
      const totalResult = await db.select({ value: count() }).from(occurrences);
      const inProgressResult = await db.select({ value: count() }).from(occurrences).where(eq(occurrences.status, 'Em Andamento'));
      const completedResult = await db.select({ value: count() }).from(occurrences).where(eq(occurrences.status, 'Concluído'));
      
      const mostCommonResult = await db.select({
        type: occurrences.type,
        count: count(occurrences.type)
      })
      .from(occurrences)
      .groupBy(occurrences.type)
      .orderBy(desc(count(occurrences.type)))
      .limit(1);

      res.json({
        totalOccurrences: totalResult[0]?.value || 0,
        inProgressOccurrences: inProgressResult[0]?.value || 0,
        completedOccurrences: completedResult[0]?.value || 0,
        mostCommonType: mostCommonResult.length > 0 ? mostCommonResult[0].type : 'N/A',
      });

    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(500).json({ message: "Erro interno do servidor ao buscar estatísticas." });
    }
  });

  return app as any;
}