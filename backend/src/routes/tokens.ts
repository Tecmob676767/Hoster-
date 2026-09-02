import { Router, Request } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

type AuthUser = { id: string };

// ─── Generate AI upload token ─────────────────────────────────────────────────
router.post('/', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const { projectId, name, expiresIn = '1h' } = req.body;

  if (!projectId) {
    res.status(400).json({ error: 'projectId is required' });
    return;
  }
  if (!name?.trim()) {
    res.status(400).json({ error: 'Token name is required (e.g. "Claude Upload")' });
    return;
  }

  // Verify ownership
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Parse expiry
  const expiryMap: Record<string, number> = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
  };
  const expiryMs = expiryMap[expiresIn] ?? 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + expiryMs);

  const tokenId = uuidv4();

  // Sign JWT
  const jwtToken = jwt.sign(
    { tokenId, projectId, userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
  );

  // Save to DB
  const dbToken = await prisma.aIToken.create({
    data: {
      id: tokenId,
      userId: user.id,
      projectId,
      name: name.trim(),
      token: jwtToken,
      expiresAt,
    },
  });

  const uploadEndpoint = `${process.env.BASE_URL || 'http://localhost:4000'}/api/upload/${projectId}`;

  res.status(201).json({
    id: dbToken.id,
    name: dbToken.name,
    token: jwtToken,
    expiresAt,
    projectId,
    projectName: project.name,
    // Instructions for AI agent
    usage: {
      endpoint: uploadEndpoint,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'multipart/form-data',
      },
      body: 'Form field: files[] (attach your project files)',
      example: `curl -X POST "${uploadEndpoint}" \\\n  -H "Authorization: Bearer ${jwtToken}" \\\n  -F "files[]=@index.html" \\\n  -F "files[]=@style.css"`,
    },
  });
});

// ─── List active tokens ───────────────────────────────────────────────────────
router.get('/', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const { projectId } = req.query;

  const tokens = await prisma.aIToken.findMany({
    where: {
      userId: user.id,
      ...(projectId ? { projectId: projectId as string } : {}),
    },
    include: { project: { select: { name: true, subdomain: true } } },
    orderBy: { createdAt: 'desc' },
  });

  // Return tokens without the raw JWT for security (show masked)
  const masked = tokens.map(t => ({
    id: t.id,
    name: t.name,
    projectId: t.projectId,
    projectName: t.project.name,
    expiresAt: t.expiresAt,
    usedAt: t.usedAt,
    revoked: t.revoked,
    createdAt: t.createdAt,
    tokenPreview: `${t.token.substring(0, 20)}...`,
  }));

  res.json(masked);
});

// ─── Reveal token (one-time) ──────────────────────────────────────────────────
router.get('/:id/reveal', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const token = await prisma.aIToken.findFirst({
    where: { id: req.params.id, userId: user.id },
  });
  if (!token) {
    res.status(404).json({ error: 'Token not found' });
    return;
  }
  if (token.revoked || new Date() > token.expiresAt) {
    res.status(410).json({ error: 'Token is expired or revoked' });
    return;
  }
  res.json({ token: token.token });
});

// ─── Revoke token ─────────────────────────────────────────────────────────────
router.delete('/:id', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const token = await prisma.aIToken.findFirst({
    where: { id: req.params.id, userId: user.id },
  });
  if (!token) {
    res.status(404).json({ error: 'Token not found' });
    return;
  }
  await prisma.aIToken.update({
    where: { id: token.id },
    data: { revoked: true },
  });
  res.json({ message: 'Token revoked successfully' });
});

export default router;
