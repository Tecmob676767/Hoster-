import { Router, Request } from 'express';
import jwt from 'jsonwebtoken';
import { query, queryOne } from '../db';
import { requireAuth } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
type AuthUser = { id: string };

router.post('/', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const { projectId, name, expiresIn = '1h' } = req.body;
  if (!projectId) { res.status(400).json({ error: 'projectId is required' }); return; }
  if (!name?.trim()) { res.status(400).json({ error: 'Token name is required' }); return; }

  const project = await queryOne<{ id: string; name: string }>('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [projectId, user.id]);
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }

  const expiryMap: Record<string, number> = {
    '1h': 3600000, '6h': 21600000, '24h': 86400000, '7d': 604800000,
  };
  const expiryMs = expiryMap[expiresIn] ?? 3600000;
  const expiresAt = new Date(Date.now() + expiryMs);
  const tokenId = uuidv4();

  const jwtToken = jwt.sign({ tokenId, projectId, userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });

  await query(`
    INSERT INTO ai_tokens (id, user_id, project_id, name, token, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [tokenId, user.id, projectId, name.trim(), jwtToken, expiresAt]);

  const uploadEndpoint = `${process.env.BASE_URL || 'http://localhost:4000'}/api/upload/${projectId}`;
  res.status(201).json({
    id: tokenId, name: name.trim(), token: jwtToken, expiresAt, projectId,
    projectName: project.name,
    usage: {
      endpoint: uploadEndpoint, method: 'POST',
      headers: { Authorization: `Bearer ${jwtToken}`, 'Content-Type': 'multipart/form-data' },
      body: 'Form field: files[] (attach your project files)',
      example: `curl -X POST "${uploadEndpoint}" \\\n  -H "Authorization: Bearer ${jwtToken}" \\\n  -F "files[]=@index.html" \\\n  -F "files[]=@style.css"`,
    },
  });
});

router.get('/', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const { projectId } = req.query;
  const tokens = await query(`
    SELECT t.*, p.name as project_name
    FROM ai_tokens t JOIN projects p ON t.project_id = p.id
    WHERE t.user_id = $1 ${projectId ? 'AND t.project_id = $2' : ''}
    ORDER BY t.created_at DESC
  `, projectId ? [user.id, projectId] : [user.id]);

  const masked = tokens.map((t: Record<string, unknown>) => ({
    ...t,
    token: undefined,
    tokenPreview: `${(t.token as string).substring(0, 20)}...`,
  }));
  res.json(masked);
});

router.get('/:id/reveal', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const token = await queryOne<{ token: string; revoked: boolean; expires_at: string }>('SELECT * FROM ai_tokens WHERE id = $1 AND user_id = $2', [req.params.id, user.id]);
  if (!token) { res.status(404).json({ error: 'Token not found' }); return; }
  if (token.revoked || new Date() > new Date(token.expires_at)) {
    res.status(410).json({ error: 'Token is expired or revoked' }); return;
  }
  res.json({ token: token.token });
});

router.delete('/:id', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const token = await queryOne('SELECT id FROM ai_tokens WHERE id = $1 AND user_id = $2', [req.params.id, user.id]);
  if (!token) { res.status(404).json({ error: 'Token not found' }); return; }
  await query('UPDATE ai_tokens SET revoked = true WHERE id = $1', [req.params.id]);
  res.json({ message: 'Token revoked' });
});

export default router;
