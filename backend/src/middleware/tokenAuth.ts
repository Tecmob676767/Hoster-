import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TokenPayload {
  tokenId: string;
  projectId: string;
  userId: string;
}

/**
 * Middleware that validates AI upload tokens (Bearer JWT).
 * Used on upload routes to allow AI agents to deploy files.
 */
export async function requireToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'AI token required. Use: Authorization: Bearer <your-token>',
    });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    // Look up token in DB
    const dbToken = await prisma.aIToken.findUnique({
      where: { id: payload.tokenId },
      include: { project: true, user: true },
    });

    if (!dbToken) {
      res.status(401).json({ error: 'Token not found' });
      return;
    }
    if (dbToken.revoked) {
      res.status(401).json({ error: 'Token has been revoked' });
      return;
    }
    if (new Date() > dbToken.expiresAt) {
      res.status(401).json({ error: 'Token has expired' });
      return;
    }

    // Attach token info to request for use in route handlers
    (req as Request & { tokenData: typeof dbToken }).tokenData = dbToken;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired AI token' });
  }
}

/**
 * Middleware that accepts EITHER a session user OR a valid AI token.
 * Used on upload routes to support both manual and AI uploads.
 */
export async function requireAuthOrToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.isAuthenticated()) {
    return next();
  }

  // Try token auth
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return requireToken(req, res, next);
  }

  res.status(401).json({ error: 'Login required or provide an AI upload token.' });
}
