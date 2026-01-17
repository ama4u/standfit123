import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import session from "express-session";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from 'fs';

const app = express();

// Initialize database persistence system
console.log('🛡️  Initializing database persistence...');
try {
  const { ensureDatabasePersistence } = await import("../auto-backup-restore.js");
  await ensureDatabasePersistence();
} catch (error) {
  console.error('⚠️  Database persistence system failed to initialize:', error.message);
}

// Trust proxy for Heroku
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? ["https://standfit-e816d09b795a.herokuapp.com"]
    : ["http://localhost:5000", "http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration with PostgreSQL store for production
let sessionConfig: any = {
  secret: process.env.SESSION_SECRET || "standfit-wholesale-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for Heroku compatibility
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  },
};

// Use PostgreSQL session store in production
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  try {
    const pgSession = (await import('connect-pg-simple')).default(session);
    const { Pool } = await import('pg');
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    sessionConfig.store = new pgSession({
      pool: pool,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    });
    
    console.log('🗄️  Using PostgreSQL session store');
  } catch (error) {
    console.error('⚠️  Failed to setup PostgreSQL session store:', error.message);
    console.log('📝 Falling back to memory store');
  }
} else {
  console.log('💾 Using memory session store (development)');
}

app.use(session(sessionConfig));

// Debug middleware for sessions
app.use((req, res, next) => {
  if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/admin')) {
    console.log(`${req.method} ${req.path} - Session ID: ${req.sessionID}, User: ${req.session?.userId}, Admin: ${req.session?.adminId}`);
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Serve uploaded files statically (both in dev and prod)
  app.use(
    "/uploads",
    express.static(path.resolve(process.cwd(), "uploads"))
  );

  // Serve the attached_assets folder so client can request images directly
  app.use(
    "/attached_assets",
    express.static(path.resolve(process.cwd(), "attached_assets"))
  );

  // Serve favicon explicitly to avoid 503 when missing
  app.get('/favicon.ico', (req, res) => {
    try {
      const attachedFav = path.resolve(process.cwd(), 'attached_assets', 'favicon.ico');
      const distFav = path.resolve(process.cwd(), 'dist', 'public', 'favicon.ico');
      const logoFallback = path.resolve(process.cwd(), 'dist', 'public', 'assets', 'standfit logo_1756828194925-CfQ7TYBl.jpg');

      if (fs.existsSync(attachedFav)) {
        return res.sendFile(attachedFav);
      }
      if (fs.existsSync(distFav)) {
        return res.sendFile(distFav);
      }
      if (fs.existsSync(logoFallback)) {
        // serve logo as fallback (browsers accept png/jpg as favicon)
        return res.sendFile(logoFallback);
      }

      // No favicon available — return 204 No Content so browser stops requesting
      return res.status(204).end();
    } catch (err) {
      // On error, send no content
      return res.status(204).end();
    }
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use Heroku's PORT environment variable or fallback to 5000 for local development
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;

  server.listen(port, () => {
    log(`🚀 Server running on port ${port}`);
    log(`📱 Local: http://localhost:${port}`);
    if (process.env.NODE_ENV === "production") {
      log(`🌐 Production: https://standfit-e816d09b795a.herokuapp.com`);
    }
  }).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      log(`❌ Port ${port} is already in use!`);
      log(`💡 Please stop any other processes using port ${port} and try again.`);
      process.exit(1);
    } else {
      throw err;
    }
  });
})();
