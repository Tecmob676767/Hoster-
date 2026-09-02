import { Router, Request } from 'express';
import { query, queryOne } from '../db';
import { requireAuth } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const router = Router();
type AuthUser = { id: string };

router.get('/', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const projects = await query(`
    SELECT p.*, 
      (SELECT row_to_json(d) FROM (
        SELECT * FROM deployments WHERE project_id = p.id ORDER BY created_at DESC LIMIT 1
      ) d) AS last_deployment
    FROM projects p WHERE p.user_id = $1
    ORDER BY p.updated_at DESC
  `, [user.id]);
  res.json(projects);
});

router.get('/:id', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await queryOne('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [req.params.id, user.id]);
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
  const deployments = await query('SELECT * FROM deployments WHERE project_id = $1 ORDER BY created_at DESC', [req.params.id]);
  const aiTokens = await query('SELECT * FROM ai_tokens WHERE project_id = $1 AND revoked = false ORDER BY created_at DESC', [req.params.id]);
  res.json({ ...project, deployments, aiTokens });
});

router.post('/', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const { name, description } = req.body;
  if (!name?.trim()) { res.status(400).json({ error: 'Project name is required' }); return; }
  const id = uuidv4();
  const filesPath = path.resolve(process.env.UPLOADS_DIR || './uploads', id);
  fs.mkdirSync(filesPath, { recursive: true });
  const project = await queryOne(`
    INSERT INTO projects (id, name, description, user_id, files_path)
    VALUES ($1, $2, $3, $4, $5) RETURNING *
  `, [id, name.trim(), description?.trim() || null, user.id, filesPath]);
  res.status(201).json(project);
});

router.patch('/:id', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const { name, description } = req.body;
  const project = await queryOne('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [req.params.id, user.id]);
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
  const updated = await queryOne(`
    UPDATE projects SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *
  `, [name?.trim(), description?.trim() || null, req.params.id]);
  res.json(updated);
});

router.delete('/:id', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await queryOne<{ files_path: string }>('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [req.params.id, user.id]);
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
  if (fs.existsSync(project.files_path)) fs.rmSync(project.files_path, { recursive: true, force: true });
  await query('DELETE FROM projects WHERE id = $1', [req.params.id]);
  res.json({ message: 'Project deleted' });
});

router.get('/:id/deployments', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await queryOne('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [req.params.id, user.id]);
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
  const deployments = await query('SELECT * FROM deployments WHERE project_id = $1 ORDER BY created_at DESC', [req.params.id]);
  res.json(deployments);
});

export default router;
