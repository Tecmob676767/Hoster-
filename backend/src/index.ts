import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { initDB } from './db';

import './auth/passport';
import authRouter from './routes/auth';
import projectsRouter from './routes/projects';
import uploadRouter from './routes/upload';
import tokensRouter from './routes/tokens';
import domainsRouter from './routes/domains';

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Ensure uploads directory exists ─────────────────────────────────────────
const uploadsDir = process.env.UPLOADS_DIR || './uploads';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Session ─────────────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false, saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 604800000 },
}));

// ─── Passport ────────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/tokens', tokensRouter);
app.use('/api/domains', domainsRouter);

// ─── Dev: serve uploaded sites statically ───────────────────────────────────
app.use('/sites', express.static(path.resolve(uploadsDir)));

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', platform: 'Hoster++', version: '1.0.0' }));

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Hoster++]', err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
(async () => {
  await initDB(); // Create tables if they don't exist
  app.listen(PORT, () => {
    console.log(`🚀 Hoster++ running at http://localhost:${PORT}`);
    console.log(`   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
})();

export default app;
