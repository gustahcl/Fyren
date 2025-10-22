import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db"
import "dotenv/config";
import path from "path";

console.log("Iniciando servidor...");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), "client")))

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

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
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
    const httpServer = app.listen(port, 'localhost', () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
})();