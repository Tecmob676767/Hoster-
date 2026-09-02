import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { requireAuthOrToken } from '../middleware/tokenAuth';
import { requireAuth } from '../middleware/auth';
import { generateNginxConfig } from '../services/deploy';

const router = Router();
const prisma = new PrismaClient();
type AuthUser = { id: string };

// ─── Multer storage ───────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: async (req, _file, cb) => {
    const project = await prisma.project.findFirst({ where: { id: req.params.projectId } });
    if (!project) return cb(new Error('Project not found'), '');
    const stagingDir = path.join(project.filesPath, '.staging');
    fs.mkdirSync(stagingDir, { recursive: true });
    cb(null, stagingDir);
  },
  filename: (_req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// ─── Upload files (manual OR AI token) ───────────────────────────────────────
router.post('/:projectId', requireAuthOrToken, upload.array('files', 500), async (req: Request, res) => {
  const projectId = req.params.projectId;
  const files = req.files as Express.Multer.File[];
  if (!files?.length) { res.status(400).json({ error: 'No files uploaded' }); return; }

  let uploadedBy = 'user';
  let userId: string;
  const tokenData = (req as Request & { tokenData?: { id: string; userId: string; projectId: string } }).tokenData;

  if (tokenData) {
    if (tokenData.projectId !== projectId) {
      res.status(403).json({ error: 'Token is not authorized for this project' }); return;
    }
    uploadedBy = `ai-token:${tokenData.id}`;
    userId = tokenData.userId;
    await prisma.aIToken.update({ where: { id: tokenData.id }, data: { usedAt: new Date() } });
  } else {
    userId = (req.user as AuthUser).id;
  }

  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }

  try {
    const stagingDir = path.join(project.filesPath, '.staging');
    let totalSize = 0;

    for (const entry of fs.readdirSync(stagingDir)) {
      const src = path.join(stagingDir, entry);
      const dest = path.join(project.filesPath, entry);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.renameSync(src, dest);
      totalSize += fs.statSync(dest).size;
    }
    fs.rmdirSync(stagingDir, { recursive: true } as fs.RmDirOptions);

    const lastDeploy = await prisma.deployment.findFirst({ where: { projectId }, orderBy: { version: 'desc' } });
    const version = (lastDeploy?.version ?? 0) + 1;

    await prisma.deployment.create({
      data: { projectId, version, uploadedBy, fileCount: files.length, sizeBytes: BigInt(totalSize), status: 'SUCCESS' },
    });
    await prisma.project.update({ where: { id: projectId }, data: { status: 'ACTIVE', updatedAt: new Date() } });
    await generateNginxConfig(project);

    const siteUrl = project.customDomain ? `https://${project.customDomain}` : null;
    res.json({
      success: true,
      message: `🚀 Deployed ${files.length} file(s) as version ${version}`,
      version, fileCount: files.length, sizeBytes: totalSize, siteUrl, uploadedBy,
    });
  } catch (err) {
    res.status(500).json({ error: 'Deployment failed', details: (err as Error).message });
  }
});

// ─── List deployed files ──────────────────────────────────────────────────────
router.get('/:projectId/files', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await prisma.project.findFirst({ where: { id: req.params.projectId, userId: user.id } });
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }

  const listFiles = (dir: string, base = ''): { name: string; path: string; size: number }[] => {
    if (!fs.existsSync(dir)) return [];
    const results: { name: string; path: string; size: number }[] = [];
    for (const f of fs.readdirSync(dir)) {
      if (f === '.staging') continue;
      const full = path.join(dir, f);
      const rel = base ? `${base}/${f}` : f;
      const stat = fs.statSync(full);
      if (stat.isDirectory()) results.push(...listFiles(full, rel));
      else results.push({ name: f, path: rel, size: stat.size });
    }
    return results;
  };
  res.json(listFiles(project.filesPath));
});

export default router;
