import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import questsRoutes from './routes/quests.routes';
import characterRoutes from './routes/character.routes';
import inventoryRoutes from './routes/inventory.routes';
import statsRoutes from './routes/stats.routes';
import { Database } from './db/database';

export function createExpressApp(): express.Express {
  const app = express();

  // Initialize DB and ensure demo data exists
  const db = Database.getInstance();
  db.ensureDemoUser();

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Status & Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'online',
      service: 'LifeRPG Backend Sovereign Core',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Segregated Backend API Route Mounts
  app.use('/api/auth', authRoutes);
  app.use('/api/quests', questsRoutes);
  app.use('/api/character', characterRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/stats', statsRoutes);

  // Global API Error Handler
  app.use('/api/*', (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Backend API Error:', err);
    res.status(500).json({
      error: 'An unexpected realm anomaly occurred.',
      details: err?.message || 'Unknown server error',
    });
  });

  return app;
}
