import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BackendUser } from '../models/types';

const JWT_SECRET = process.env.JWT_SECRET || 'firelink-shrine-ancient-soul-secret-key-2026';
const TOKEN_EXPIRY = '7d';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(user: BackendUser): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
  }

  static verifyToken(token: string): { id: string; email: string; username: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        username: string;
      };
      return decoded;
    } catch {
      return null;
    }
  }
}
