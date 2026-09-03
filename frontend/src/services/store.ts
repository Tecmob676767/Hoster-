export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: string;
}

export interface DeploymentFile {
  name: string;
  size: number;
  type: string;
  content?: string;
}

export interface Deployment {
  id: string;
  version: number;
  uploadedBy: string;
  fileCount: number;
  createdAt: string;
  previewHtml?: string;
}

export interface Project {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  status: 'ACTIVE' | 'BUILDING' | 'INACTIVE' | 'ERROR';
  sslEnabled: boolean;
  filesPath: string;
  deployments: Deployment[];
  files?: DeploymentFile[];
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIToken {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  token: string;
  tokenPreview: string;
  expiresAt: string;
  usedAt?: string;
  revoked: boolean;
  createdAt: string;
}

const STORAGE_KEYS = {
  USER: 'hosterpp_user',
  PROJECTS: 'hosterpp_projects',
  TOKENS: 'hosterpp_tokens',
};

// Default sample user
export const DEFAULT_USER: User = {
  id: 'usr_demo_1',
  name: 'Sarah Chen',
  email: 'sarah.chen@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'Free Unlimited',
};

export const DEMO_PERSONAS: User[] = [
  {
    id: 'usr_sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    plan: 'Free Unlimited',
  },
  {
    id: 'usr_alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@devstudio.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    plan: 'Free Unlimited',
  },
  {
    id: 'usr_david',
    name: 'David Kim',
    email: 'david.kim@ai-labs.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    plan: 'Free Unlimited',
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_nexus_portfolio',
    name: 'Nexus Developer Portfolio',
    subdomain: 'nexus-portfolio',
    customDomain: 'nexusdev.live',
    status: 'ACTIVE',
    sslEnabled: true,
    filesPath: '/var/www/nexus-portfolio',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    files: [
      { name: 'index.html', size: 3420, type: 'text/html' },
      { name: 'style.css', size: 1840, type: 'text/css' },
      { name: 'app.js', size: 5120, type: 'application/javascript' },
      { name: 'avatar.png', size: 142000, type: 'image/png' },
    ],
    deployments: [
      {
        id: 'dep_1',
        version: 3,
        uploadedBy: '🤖 AI Token (Claude Agent)',
        fileCount: 4,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'dep_2',
        version: 2,
        uploadedBy: '👤 Manual Drop',
        fileCount: 3,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'dep_3',
        version: 1,
        uploadedBy: '👤 Initial Setup',
        fileCount: 2,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
  },
  {
    id: 'proj_saas_landing',
    name: 'CloudScale SaaS Landing',
    subdomain: 'cloudscale-saas',
    customDomain: 'cloudscale.app',
    status: 'ACTIVE',
    sslEnabled: true,
    filesPath: '/var/www/cloudscale-saas',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    files: [
      { name: 'index.html', size: 8400, type: 'text/html' },
      { name: 'bundle.js', size: 94200, type: 'application/javascript' },
      { name: 'tailwind.css', size: 14200, type: 'text/css' },
    ],
    deployments: [
      {
        id: 'dep_s1',
        version: 2,
        uploadedBy: '🤖 AI Token (Cursor Agent)',
        fileCount: 3,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'dep_s2',
        version: 1,
        uploadedBy: '👤 Manual Drop',
        fileCount: 2,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
    ],
  },
  {
    id: 'proj_ai_docs',
    name: 'PromptEngine Docs',
    subdomain: 'promptengine-docs',
    customDomain: '',
    status: 'ACTIVE',
    sslEnabled: false,
    filesPath: '/var/www/promptengine-docs',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    files: [
      { name: 'index.html', size: 4200, type: 'text/html' },
      { name: 'docs.css', size: 2100, type: 'text/css' },
    ],
    deployments: [
      {
        id: 'dep_d1',
        version: 1,
        uploadedBy: '🤖 AI Token (GPT-4 Agent)',
        fileCount: 2,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ],
  },
];

const INITIAL_TOKENS: AIToken[] = [
  {
    id: 'tok_1',
    name: 'Claude 3.7 Sonnet Deployer',
    projectId: 'proj_nexus_portfolio',
    projectName: 'Nexus Developer Portfolio',
    token: 'hpp_live_948fbc923a10e77d24a91901cd',
    tokenPreview: 'hpp_live_948f...01cd',
    expiresAt: new Date(Date.now() + 86400000 * 28).toISOString(),
    usedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    revoked: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'tok_2',
    name: 'Cursor AI Fast Sync',
    projectId: 'proj_saas_landing',
    projectName: 'CloudScale SaaS Landing',
    token: 'hpp_live_1739c9103e98aa124b81ef024a',
    tokenPreview: 'hpp_live_1739...024a',
    expiresAt: new Date(Date.now() + 86400000 * 6).toISOString(),
    usedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    revoked: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

class StoreService {
  private getUserData(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.getUserData();
  }

  setUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  loginWithPersona(persona: User): User {
    const u: User = { ...persona, plan: 'Free Unlimited' };
    this.setUser(u);
    return u;
  }

  loginAsGuest(): User {
    const guest: User = {
      id: `usr_guest_${Date.now()}`,
      name: 'Guest Developer',
      email: 'guest@hosterplus.io',
      plan: 'Free Unlimited',
    };
    this.setUser(guest);
    return guest;
  }

  logout() {
    this.setUser(null);
  }

  getProjects(): Project[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PROJECTS;
    }
  }

  getProject(id: string): Project | null {
    const projects = this.getProjects();
    return projects.find(p => p.id === id) || null;
  }

  createProject(name: string, templateType?: string): Project {
    const projects = this.getProjects();
    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const newId = `proj_${Date.now().toString(36)}`;

    let sampleFiles: DeploymentFile[] = [
      { name: 'index.html', size: 1420, type: 'text/html' },
      { name: 'style.css', size: 920, type: 'text/css' },
    ];

    if (templateType === 'react') {
      sampleFiles = [
        { name: 'index.html', size: 2100, type: 'text/html' },
        { name: 'app.jsx', size: 4500, type: 'text/javascript' },
        { name: 'main.css', size: 3100, type: 'text/css' },
      ];
    } else if (templateType === 'portfolio') {
      sampleFiles = [
        { name: 'index.html', size: 3800, type: 'text/html' },
        { name: 'portfolio.css', size: 2400, type: 'text/css' },
        { name: 'projects.json', size: 1200, type: 'application/json' },
      ];
    }

    const newProject: Project = {
      id: newId,
      name,
      subdomain: cleanSlug || `site-${Date.now().toString(36)}`,
      customDomain: '',
      status: 'ACTIVE',
      sslEnabled: false,
      filesPath: `/var/www/${cleanSlug}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      files: sampleFiles,
      deployments: [
        {
          id: `dep_${Date.now()}`,
          version: 1,
          uploadedBy: '👤 Template Initializer',
          fileCount: sampleFiles.length,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    const updated = [newProject, ...projects];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    return newProject;
  }

  deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    return true;
  }

  deployFiles(
    projectId: string,
    fileList: { name: string; size: number; type: string; content?: string }[],
    uploadedBy: string = '👤 Manual Drop'
  ): { success: boolean; version: number; project: Project } {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) throw new Error('Project not found');

    const proj = projects[idx];
    const newVersion = (proj.deployments[0]?.version || 0) + 1;

    const newDep: Deployment = {
      id: `dep_${Date.now()}`,
      version: newVersion,
      uploadedBy,
      fileCount: fileList.length,
      createdAt: new Date().toISOString(),
    };

    proj.deployments = [newDep, ...proj.deployments];
    proj.files = fileList;
    proj.status = 'ACTIVE';
    proj.updatedAt = new Date().toISOString();

    projects[idx] = proj;
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

    return { success: true, version: newVersion, project: proj };
  }

  setCustomDomain(projectId: string, domain: string): Project {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) throw new Error('Project not found');

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '');
    projects[idx].customDomain = cleanDomain;
    projects[idx].sslEnabled = cleanDomain.length > 0;
    projects[idx].updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return projects[idx];
  }

  removeCustomDomain(projectId: string): Project {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) throw new Error('Project not found');

    projects[idx].customDomain = '';
    projects[idx].sslEnabled = false;
    projects[idx].updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return projects[idx];
  }

  rollbackDeployment(projectId: string, version: number): Project {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) throw new Error('Project not found');

    const proj = projects[idx];
    const newDep: Deployment = {
      id: `dep_${Date.now()}`,
      version: (proj.deployments[0]?.version || 0) + 1,
      uploadedBy: `🔄 Rollback to v${version}`,
      fileCount: proj.files?.length || 2,
      createdAt: new Date().toISOString(),
    };

    proj.deployments = [newDep, ...proj.deployments];
    proj.updatedAt = new Date().toISOString();

    projects[idx] = proj;
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return proj;
  }

  getTokens(projectId?: string): AIToken[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TOKENS);
    let tokens: AIToken[] = INITIAL_TOKENS;
    if (raw) {
      try {
        tokens = JSON.parse(raw);
      } catch {
        tokens = INITIAL_TOKENS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(INITIAL_TOKENS));
    }

    if (projectId) {
      return tokens.filter(t => t.projectId === projectId);
    }
    return tokens;
  }

  createToken(projectId: string, name: string, expiresIn: string): { token: AIToken; usage: { example: string } } {
    const tokens = this.getTokens();
    const project = this.getProject(projectId);
    const projectName = project ? project.name : 'Unknown Project';

    const randHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const fullToken = `hpp_live_${randHex}`;
    const tokenPreview = `hpp_live_${randHex.slice(0, 4)}...${randHex.slice(-4)}`;

    let ms = 3600000;
    if (expiresIn === '6h') ms = 6 * 3600000;
    else if (expiresIn === '24h') ms = 24 * 3600000;
    else if (expiresIn === '7d') ms = 7 * 86400000;
    else if (expiresIn === '30d') ms = 30 * 86400000;
    else if (expiresIn === 'never') ms = 365 * 10 * 86400000;

    const newToken: AIToken = {
      id: `tok_${Date.now()}`,
      name: name || 'AI Deployment Token',
      projectId,
      projectName,
      token: fullToken,
      tokenPreview,
      expiresAt: new Date(Date.now() + ms).toISOString(),
      revoked: false,
      createdAt: new Date().toISOString(),
    };

    const updated = [newToken, ...tokens];
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(updated));

    const example = `curl -X POST "https://hosterplus.app/api/upload/${projectId}" \\
  -H "Authorization: Bearer ${fullToken}" \\
  -F "files[]=@index.html" \\
  -F "files[]=@style.css" \\
  -F "files[]=@app.js"`;

    return { token: newToken, usage: { example } };
  }

  revokeToken(tokenId: string): boolean {
    const tokens = this.getTokens();
    const updated = tokens.map(t => (t.id === tokenId ? { ...t, revoked: true } : t));
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(updated));
    return true;
  }
}

export const store = new StoreService();
