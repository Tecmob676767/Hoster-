import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to require authenticated session (Google OAuth)
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required. Please login with Google.' });
}

/**
 * Attach the current user to res.locals for convenience
 */
export function attachUser(req: Request, res: Response, next: NextFunction): void {
  res.locals.user = req.user;
  next();
}
