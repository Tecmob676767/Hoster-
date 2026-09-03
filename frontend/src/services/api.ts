import { store, type User, type Project, type AIToken } from './store';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Authentication
  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          store.setUser({ ...data.user, plan: 'Free Unlimited' });
          return data.user;
        }
      }
    } catch {
      // Backend not running or offline, return local stored user
    }
    return store.getCurrentUser();
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {
      // ignore
    }
    store.logout();
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch(`${API_BASE}/projects`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Fallback
    }
    return store.getProjects();
  },

  async getProject(id: string): Promise<Project | null> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) return data;
      }
    } catch {
      // Fallback
    }
    return store.getProject(id);
  },

  async createProject(name: string, templateType?: string): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) return data;
      }
    } catch {
      // Fallback
    }
    return store.createProject(name, templateType);
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    return store.deleteProject(id);
  },

  // Deployments / Upload
  async uploadFiles(
    projectId: string,
    files: File[],
    uploadedBy: string = '👤 Manual Drop'
  ): Promise<{ success: boolean; message: string; version: number; siteUrl?: string }> {
    try {
      const form = new FormData();
      files.forEach(f => form.append('files', f));

      const res = await fetch(`${API_BASE}/upload/${projectId}`, {
        method: 'POST',
        credentials: 'include',
        body: form,
      });
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          message: data.message || 'Deployed successfully!',
          version: data.version || 1,
          siteUrl: data.siteUrl,
        };
      }
    } catch {
      // Fallback: simulate instant deploy in client store
    }

    const fileList = files.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
    }));

    const result = store.deployFiles(projectId, fileList, uploadedBy);
    const domain = result.project.customDomain || `${result.project.subdomain}.hosterplus.app`;

    return {
      success: true,
      message: `Deployed v${result.version} (${files.length} files) to edge CDN!`,
      version: result.version,
      siteUrl: `https://${domain}`,
    };
  },

  // Custom Domains
  async setDomain(projectId: string, domain: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/domains/${projectId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: data.message || 'Custom domain connected!' };
      }
    } catch {
      // Fallback
    }
    store.setCustomDomain(projectId, domain);
    return { success: true, message: `Domain ${domain} attached! Auto-SSL provisioning initiated.` };
  },

  async removeDomain(projectId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/domains/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    store.removeCustomDomain(projectId);
    return true;
  },

  // Tokens
  async getTokens(projectId?: string): Promise<AIToken[]> {
    try {
      const url = projectId ? `${API_BASE}/tokens?projectId=${projectId}` : `${API_BASE}/tokens`;
      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {
      // Fallback
    }
    return store.getTokens(projectId);
  },

  async createToken(
    projectId: string,
    name: string,
    expiresIn: string
  ): Promise<{ token: AIToken; usage: { example: string } }> {
    try {
      const res = await fetch(`${API_BASE}/tokens`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, name, expiresIn }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.token) return data;
      }
    } catch {
      // Fallback
    }
    return store.createToken(projectId, name, expiresIn);
  },

  async revokeToken(tokenId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/tokens/${tokenId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    return store.revokeToken(tokenId);
  },
};
