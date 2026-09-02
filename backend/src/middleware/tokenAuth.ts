import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { queryOne } from '../db';

export interface TokenPayload {
  tokenId: string; projectId: string; userId: string;
}

export async function requireToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'AI token required. Use: Authorization: Bearer <token>' });
    return;
  }
  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const dbToken = await queryOne<{
      id: string; user_id: string; project_id: string;
      revoked: boolean; expires_at: string;
    }>('SELECT * FROM ai_tokens WHERE id = $1', [payload.tokenId]);

    if (!dbToken) { res.status(401).json({ error: 'Token not found' }); return; }
    if (dbToken.revoked) { res.status(401).json({ error: 'Token has been revoked' }); return; }
    if (new Date() > new Date(dbToken.expires_at)) { res.status(401).json({ error: 'Token has expired' }); return; }

    (req as Request & { tokenData: typeof dbToken }).tokenData = dbToken;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired AI token' });
  }
}

export async function requireAuthOrToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.isAuthenticated()) return next();
  if (req.headers.authorization?.startsWith('Bearer ')) return requireToken(req, res, next);
  res.status(401).json({ error: 'Login required or provide an AI upload token.' });
}
