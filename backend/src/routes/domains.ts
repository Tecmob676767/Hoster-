import { Router, Request } from 'express';
import { query, queryOne } from '../db';
import { requireAuth } from '../middleware/auth';
import { generateNginxConfig, removeNginxConfig, provisionSSL } from '../services/deploy';

const router = Router();
type AuthUser = { id: string };

router.get('/:projectId', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await queryOne('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [req.params.projectId, user.id]);
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
  const p = project as Record<string, unknown>;
  res.json({
    projectId: p.id, customDomain: p.custom_domain, sslEnabled: p.ssl_enabled,
    siteUrl: p.custom_domain ? `https://${p.custom_domain}` : null,
    dnsInstructions: p.custom_domain ? {
      aRecord: { type: 'A', name: '@', value: process.env.SERVER_IP || '1.2.3.4' },
      www: { type: 'CNAME', name: 'www', value: p.custom_domain },
      note: 'DNS changes can take up to 48 hours to propagate.',
    } : null,
  });
});

router.post('/:projectId', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const { domain } = req.body;
  if (!domain?.trim()) { res.status(400).json({ error: 'Domain is required' }); return; }

  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
  if (!domainRegex.test(domain.trim())) { res.status(400).json({ error: 'Invalid domain format' }); return; }

  const project = await queryOne('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [req.params.projectId, user.id]);
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }

  const existing = await queryOne('SELECT id FROM projects WHERE custom_domain = $1', [domain.trim()]);
  if (existing && (existing as Record<string, unknown>).id !== req.params.projectId) {
    res.status(409).json({ error: 'Domain already used by another project' }); return;
  }

  await query('UPDATE projects SET custom_domain = $1, updated_at = NOW() WHERE id = $2', [domain.trim(), req.params.projectId]);
  const updated = await queryOne('SELECT * FROM projects WHERE id = $1', [req.params.projectId]);
  await generateNginxConfig(updated as { id: string; custom_domain: string | null; files_path: string; ssl_enabled: boolean });

  const sslOk = await provisionSSL(domain.trim());
  if (sslOk) await query('UPDATE projects SET ssl_enabled = true WHERE id = $1', [req.params.projectId]);

  res.json({
    message: 'Custom domain saved! Point your DNS records as shown below.',
    domain: domain.trim(), siteUrl: `https://${domain.trim()}`,
    dnsInstructions: {
      aRecord: { type: 'A', name: '@', value: process.env.SERVER_IP || '1.2.3.4' },
      www: { type: 'CNAME', name: 'www', value: domain.trim() },
      note: 'After adding DNS records, your site will be live. SSL is provisioned automatically.',
    },
  });
});

router.delete('/:projectId', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await queryOne('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [req.params.projectId, user.id]);
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
  await removeNginxConfig(project as { id: string; custom_domain: string | null; files_path: string; ssl_enabled: boolean });
  await query('UPDATE projects SET custom_domain = NULL, ssl_enabled = false WHERE id = $1', [req.params.projectId]);
  res.json({ message: 'Custom domain removed.' });
});

export default router;
