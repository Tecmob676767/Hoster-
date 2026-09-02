import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query, queryOne } from '../db';
import { requireAuthOrToken } from '../middleware/tokenAuth';
import { requireAuth } from '../middleware/auth';
import { generateNginxConfig } from '../services/deploy';

const router = Router();
type AuthUser = { id: string };

const storage = multer.diskStorage({
  destination: async (req, _file, cb) => {
    const project = await queryOne<{ files_path: string }>('SELECT * FROM projects WHERE id = $1', [req.params.projectId]);
    if (!project) return cb(new Error('Project not found'), '');
    const stagingDir = path.join(project.files_path, '.staging');
    fs.mkdirSync(stagingDir, { recursive: true });
    cb(null, stagingDir);
  },
  filename: (_req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/:projectId', requireAuthOrToken, upload.array('files', 500), async (req: Request, res) => {
  const projectId = req.params.projectId;
  const files = req.files as Express.Multer.File[];
  if (!files?.length) { res.status(400).json({ error: 'No files uploaded' }); return; }

  let uploadedBy = 'user';
  let userId: string;
  const tokenData = (req as Request & { tokenData?: { id: string; userId: string; projectId: string } }).tokenData;

  if (tokenData) {
    if (tokenData.projectId !== projectId) {
      res.status(403).json({ error: 'Token not authorized for this project' }); return;
    }
    uploadedBy = `ai-token:${tokenData.id}`;
    userId = tokenData.userId;
    await query('UPDATE ai_tokens SET used_at = NOW() WHERE id = $1', [tokenData.id]);
  } else {
    userId = (req.user as AuthUser).id;
  }

  const project = await queryOne<{ id: string; files_path: string; custom_domain: string | null; ssl_enabled: boolean }>(
    'SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]
  );
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }

  try {
    const stagingDir = path.join(project.files_path, '.staging');
    let totalSize = 0;
    for (const entry of fs.readdirSync(stagingDir)) {
      const src = path.join(stagingDir, entry);
      const dest = path.join(project.files_path, entry);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.renameSync(src, dest);
      totalSize += fs.statSync(dest).size;
    }
    fs.rmdirSync(stagingDir);

    const lastDeploy = await queryOne<{ version: number }>(
      'SELECT version FROM deployments WHERE project_id = $1 ORDER BY created_at DESC LIMIT 1', [projectId]
    );
    const version = (lastDeploy?.version ?? 0) + 1;

    await query(`
      INSERT INTO deployments (project_id, version, uploaded_by, file_count, size_bytes, status)
      VALUES ($1, $2, $3, $4, $5, 'SUCCESS')
    `, [projectId, version, uploadedBy, files.length, totalSize]);

    await query(`UPDATE projects SET status = 'ACTIVE', updated_at = NOW() WHERE id = $1`, [projectId]);
    await generateNginxConfig(project);

    res.json({
      success: true,
      message: `🚀 Deployed ${files.length} file(s) as version ${version}`,
      version, fileCount: files.length, sizeBytes: totalSize,
      siteUrl: project.custom_domain ? `https://${project.custom_domain}` : null,
      uploadedBy,
    });
  } catch (err) {
    res.status(500).json({ error: 'Deployment failed', details: (err as Error).message });
  }
});

router.get('/:projectId/files', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await queryOne<{ files_path: string }>('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [req.params.projectId, user.id]);
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }

  const listFiles = (dir: string, base = ''): { name: string; path: string; size: number }[] => {
    if (!fs.existsSync(dir)) return [];
    const results: { name: string; path: string; size: number }[] = [];
    for (const f of fs.readdirSync(dir)) {
      if (f === '.staging') continue;
      const full = path.join(dir, f);
      const rel = base ? `${base}/${f}` : f;
      if (fs.statSync(full).isDirectory()) results.push(...listFiles(full, rel));
      else results.push({ name: f, path: rel, size: fs.statSync(full).size });
    }
    return results;
  };
  res.json(listFiles(project.files_path));
});

export default router;
