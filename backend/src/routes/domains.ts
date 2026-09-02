import { Router, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { generateNginxConfig, removeNginxConfig, provisionSSL } from '../services/deploy';

const router = Router();
const prisma = new PrismaClient();
type AuthUser = { id: string };

// ─── Get domain info ──────────────────────────────────────────────────────────
router.get('/:projectId', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await prisma.project.findFirst({
    where: { id: req.params.projectId, userId: user.id },
  });
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }

  res.json({
    projectId: project.id,
    customDomain: project.customDomain,
    sslEnabled: project.sslEnabled,
    siteUrl: project.customDomain
      ? `https://${project.customDomain}`
      : null,
    dnsInstructions: project.customDomain ? {
      aRecord: { type: 'A', name: '@', value: process.env.SERVER_IP || '1.2.3.4' },
      www: { type: 'CNAME', name: 'www', value: project.customDomain },
      note: 'DNS changes can take up to 48 hours to propagate.',
    } : null,
  });
});

// ─── Add / update custom domain ───────────────────────────────────────────────
router.post('/:projectId', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const { domain } = req.body;

  if (!domain?.trim()) { res.status(400).json({ error: 'Domain is required' }); return; }

  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
  if (!domainRegex.test(domain.trim())) {
    res.status(400).json({ error: 'Invalid domain format (e.g. myapp.com)' });
    return;
  }

  const project = await prisma.project.findFirst({
    where: { id: req.params.projectId, userId: user.id },
  });
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }

  // Check domain not taken by another project
  const existing = await prisma.project.findFirst({ where: { customDomain: domain.trim() } });
  if (existing && existing.id !== project.id) {
    res.status(409).json({ error: 'Domain already used by another project' });
    return;
  }

  const updated = await prisma.project.update({
    where: { id: project.id },
    data: { customDomain: domain.trim() },
  });

  // Generate Nginx config
  await generateNginxConfig(updated);

  // Try SSL provisioning (production only — no-op in dev)
  const sslOk = await provisionSSL(domain.trim());
  if (sslOk) {
    await prisma.project.update({ where: { id: project.id }, data: { sslEnabled: true } });
  }

  res.json({
    message: 'Custom domain saved! Point your DNS records as shown below.',
    domain: domain.trim(),
    siteUrl: `https://${domain.trim()}`,
    dnsInstructions: {
      aRecord: { type: 'A', name: '@', value: process.env.SERVER_IP || '1.2.3.4' },
      www: { type: 'CNAME', name: 'www', value: domain.trim() },
      note: 'After adding DNS records, your site will be live at your domain. SSL is provisioned automatically.',
    },
  });
});

// ─── Remove custom domain ─────────────────────────────────────────────────────
router.delete('/:projectId', requireAuth, async (req: Request, res) => {
  const user = req.user as AuthUser;
  const project = await prisma.project.findFirst({
    where: { id: req.params.projectId, userId: user.id },
  });
  if (!project) { res.status(404).json({ error: 'Project not found' }); return; }

  await removeNginxConfig(project);
  await prisma.project.update({
    where: { id: project.id },
    data: { customDomain: null, sslEnabled: false },
  });
  res.json({ message: 'Custom domain removed. Your site is now offline until a domain is added.' });
});

export default router;
