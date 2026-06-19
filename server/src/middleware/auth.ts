import jwt from 'jsonwebtoken';
import type { Response, NextFunction } from 'express';
import type { Request } from 'express';

export interface UserPayload {
  id: number;
  email: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Authentication token required.' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'super_secret_carbon_mirror_token_key_2026';

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token.' });
      return;
    }

    req.user = decoded as UserPayload;
    next();
  });
};
