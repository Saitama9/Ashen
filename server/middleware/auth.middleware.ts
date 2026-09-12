import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { Database } from '../db/database';
import { BackendUser } from '../models/types';

export interface AuthenticatedRequest extends Request {
  user?: BackendUser;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  const db = Database.getInstance();

  if (!token) {
    // If no token provided, check if demo user exists and attach as fallback for seamless demo exploration
    const { user } = db.ensureDemoUser();
    req.user = user;
    return next();
  }

  const payload = AuthService.verifyToken(token);
  if (!payload) {
    // Invalid or expired token
    res.status(401).json({ error: 'Token expired or invalid. Please re-authenticate.' });
    return;
  }

  const user = db.findUserById(payload.id);
  if (!user) {
    res.status(401).json({ error: 'User associated with token no longer exists.' });
    return;
  }

  req.user = user;
  next();
};

export const requireStrictAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Authentication token required.' });
    return;
  }

  const payload = AuthService.verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Token expired or invalid.' });
    return;
  }

  const db = Database.getInstance();
  const user = db.findUserById(payload.id);
  if (!user) {
    res.status(401).json({ error: 'User does not exist.' });
    return;
  }

  req.user = user;
  next();
};
