import { Router, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

type AuthUser = { id: string; name: string; email: string };

// ─── List user's projects ─────────────────────────────────────────────────────
router.get('/', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: {
      deployments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
  res.json(projects);
});

// ─── Get single project ───────────────────────────────────────────────────────
router.get('/:id', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, userId: user.id },
    include: {
      deployments: { orderBy: { createdAt: 'desc' } },
      aiTokens: { where: { revoked: false }, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
  res.json(project);
});

// ─── Create project ───────────────────────────────────────────────────────────
router.post('/', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const { name, description } = req.body;
  if (!name?.trim()) { res.status(400).json({ error: 'Project name is required' }); return; }

  const id = uuidv4();
  const filesPath = path.resolve(process.env.UPLOADS_DIR || './uploads', id);
  fs.mkdirSync(filesPath, { recursive: true });

  const project = await prisma.project.create({
    data: {
      id,
      name: name.trim(),
      description: description?.trim(),
      userId: user.id,
      filesPath,
      status: 'INACTIVE',
    },
  });
  res.status(201).json(project);
});

// ─── Update project ───────────────────────────────────────────────────────────
router.patch('/:id', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const { name, description } = req.body;
  const project = await prisma.project.findFirst({ where: { id: req.params.id, userId: user.id } });
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
  const updated = await prisma.project.update({
    where: { id: project.id },
    data: { name: name?.trim(), description: description?.trim() },
  });
  res.json(updated);
});

// ─── Delete project ───────────────────────────────────────────────────────────
router.delete('/:id', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await prisma.project.findFirst({ where: { id: req.params.id, userId: user.id } });
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
  if (fs.existsSync(project.filesPath)) {
    fs.rmSync(project.filesPath, { recursive: true, force: true });
  }
  await prisma.project.delete({ where: { id: project.id } });
  res.json({ message: 'Project deleted' });
});

// ─── Get deployment history ───────────────────────────────────────────────────
router.get('/:id/deployments', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await prisma.project.findFirst({ where: { id: req.params.id, userId: user.id } });
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
  const deployments = await prisma.deployment.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(deployments);
});

export default router;
