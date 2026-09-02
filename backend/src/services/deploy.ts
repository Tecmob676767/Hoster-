import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface Project {
  id: string;
  customDomain?: string | null;
  filesPath: string;
  sslEnabled: boolean;
}

const NGINX_SITES_DIR = process.env.NGINX_SITES_DIR || '/etc/nginx/sites-enabled';
const NGINX_RELOAD = process.env.NGINX_RELOAD_CMD || 'sudo nginx -s reload';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Generate Nginx virtual host config for a project (custom domain only).
 * In development, writes to ./nginx-configs/ for inspection.
 */
export async function generateNginxConfig(project: Project): Promise<void> {
  if (!project.customDomain) return; // No domain = no config

  const domain = project.customDomain;
  const wwwDomain = `www.${domain}`;

  const httpConfig = `# Hoster++ — Auto-generated for project ${project.id}
server {
    listen 80;
    server_name ${domain} ${wwwDomain};
    root ${project.filesPath};
    index index.html index.htm;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    add_header X-Powered-By "Hoster++";
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / { try_files $uri $uri/ /index.html; }
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y; add_header Cache-Control "public, immutable";
    }
    location ~ /\\. { deny all; }
}
`;

  const httpsConfig = project.sslEnabled ? `
server {
    listen 443 ssl http2;
    server_name ${domain} ${wwwDomain};
    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    root ${project.filesPath};
    index index.html index.htm;
    gzip on;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Powered-By "Hoster++";
    location / { try_files $uri $uri/ /index.html; }
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y; add_header Cache-Control "public, immutable";
    }
    location ~ /\\. { deny all; }
}
server {
    listen 80;
    server_name ${domain} ${wwwDomain};
    return 301 https://$host$request_uri;
}
` : '';

  const config = project.sslEnabled ? httpsConfig : httpConfig;
  const filename = `hosterplus-${project.id}.conf`;

  if (IS_PRODUCTION) {
    fs.writeFileSync(path.join(NGINX_SITES_DIR, filename), config, 'utf8');
    try { await execAsync(NGINX_RELOAD); } catch (e) { console.error('[Nginx] reload failed:', e); }
  } else {
    const devDir = path.resolve('./nginx-configs');
    fs.mkdirSync(devDir, { recursive: true });
    fs.writeFileSync(path.join(devDir, filename), config, 'utf8');
    console.log(`[Dev] Nginx config → nginx-configs/${filename}`);
  }
}

export async function removeNginxConfig(project: Project): Promise<void> {
  const filename = `hosterplus-${project.id}.conf`;
  const configPath = IS_PRODUCTION
    ? path.join(NGINX_SITES_DIR, filename)
    : path.join('./nginx-configs', filename);
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
    if (IS_PRODUCTION) {
      try { await execAsync(NGINX_RELOAD); } catch (e) { console.error('[Nginx] reload failed:', e); }
    }
  }
}

export async function provisionSSL(domain: string): Promise<boolean> {
  if (!IS_PRODUCTION) { console.log(`[Dev] SSL skipped for ${domain}`); return false; }
  try {
    const email = process.env.SSL_EMAIL || 'admin@hosterplus.app';
    await execAsync(`sudo certbot --nginx -d ${domain} -d www.${domain} --non-interactive --agree-tos --email ${email}`);
    return true;
  } catch (e) {
    console.error('[SSL] Certbot failed:', e);
    return false;
  }
}
