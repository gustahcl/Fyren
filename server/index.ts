import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db"

console.log("Database config:", db);
console.log("Servidor iniciado!");
// Cria a instância principal da aplicação Express.
const app = express();

// Middleware para interpretar o corpo de requisições como JSON.
app.use(express.json());
// Middleware para interpretar dados de formulários.
app.use(express.urlencoded({ extended: false }));

// Middleware customizado para logar as requisições à API.
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      log(logLine);
    }
  });

  next();
});

// Função principal assíncrona para configurar e iniciar o servidor.
(async () => {
  // Regista todas as rotas da API (de 'routes.ts') na aplicação Express.
  const server = await registerRoutes(app);

  // Middleware para tratamento de erros.
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Erro Interno do Servidor";
    res.status(status).json({ message });
  });

  // Distingue entre ambiente de desenvolvimento e produção.
  if (process.env.NODE_ENV === "development") {
    // Em desenvolvimento, usa o Vite como middleware para servir o frontend com Hot Reloading.
    await setupVite(app, server);
  } else {
    // Em produção, serve os ficheiros estáticos já compilados da pasta 'dist/public'.
    serveStatic(app);
  }

  // Define a porta do servidor, usando a variável de ambiente PORT ou 5000 como padrão.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  // Inicia o servidor para escutar por requisições.
  server.listen({
    port,
    host: "127.0.0.1", // ALTERAÇÃO: Força o servidor a escutar no endereço IPv4 de localhost.
    reusePort: true,
  }, () => {
    log(`Servidor a correr na porta ${port}`);
  });
})();