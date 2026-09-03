import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { User, Project } from '../services/store';
import { api } from '../services/api';
import { 
  Plus, Globe, Trash2, Bot, 
  Search, ArrowUpRight
} from 'lucide-react';

interface Props {
  user: User;
}

export default function Dashboard({ user }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'blank' | 'react' | 'portfolio'>('portfolio');
  const [showCreate, setShowCreate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'custom-domain' | 'ai'>('all');

  const loadProjects = async () => {
    setLoading(true);
    const data = await api.getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    await api.createProject(newName.trim(), selectedTemplate);
    setNewName('');
    setShowCreate(false);
    setCreating(false);
    loadProjects();
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project and all deployed versions?')) return;
    await api.deleteProject(id);
    loadProjects();
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.customDomain && p.customDomain.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (activeFilter === 'custom-domain') return Boolean(p.customDomain);
    if (activeFilter === 'ai') return p.deployments.some(d => d.uploadedBy.includes('AI'));
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Dashboard Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E2DC]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#666970] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2AB09C] pulse-dot" />
            Hoster++ Studio
          </div>
          <h1 className="text-3xl font-black text-[#121316] tracking-tight">
            Welcome back, <span className="accent">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-xs text-[#666970] font-medium mt-1">
            Manage your websites, custom domains, and AI deployment tokens.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="lb-btn-coral text-sm font-bold shadow-[0_3px_0_#b31634] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="lb-card border-2 border-[#121316] p-4 bg-[#FFFFFF]">
          <div className="text-xs font-bold text-[#666970]">Active Projects</div>
          <div className="text-2xl font-black text-[#121316] mt-0.5">{projects.length}</div>
        </div>
        <div className="lb-card border-2 border-[#121316] p-4 bg-[#FFFFFF]">
          <div className="text-xs font-bold text-[#666970]">Custom Domains</div>
          <div className="text-2xl font-black text-[#121316] mt-0.5">
            {projects.filter(p => p.customDomain).length}
          </div>
        </div>
        <div className="lb-card border-2 border-[#121316] p-4 bg-[#FFFFFF]">
          <div className="text-xs font-bold text-[#666970]">Global SSL Status</div>
          <div className="text-2xl font-black text-[#2AB09C] mt-0.5">100% Active</div>
        </div>
        <div className="lb-card border-2 border-[#121316] p-4 bg-[#FFFFFF]">
          <div className="text-xs font-bold text-[#666970]">Platform Plan</div>
          <div className="text-2xl font-black text-[#F12850] mt-0.5">Unlimited Free</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex gap-1.5 p-1 bg-[#FFFFFF] border-2 border-[#121316] rounded-full shadow-[0_2px_0_#121316] w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#121316] text-white shadow-sm'
                : 'text-[#666970] hover:text-[#121316]'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveFilter('custom-domain')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'custom-domain'
                ? 'bg-[#121316] text-white shadow-sm'
                : 'text-[#666970] hover:text-[#121316]'
            }`}
          >
            Custom Domains ({projects.filter(p => p.customDomain).length})
          </button>
          <button
            onClick={() => setActiveFilter('ai')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'ai'
                ? 'bg-[#121316] text-white shadow-sm'
                : 'text-[#666970] hover:text-[#121316]'
            }`}
          >
            AI Deployed
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#666970] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 rounded-full border-2 border-[#121316] bg-[#FFFFFF] text-xs font-bold text-[#121316] placeholder-[#888] focus:outline-none shadow-[0_2px_0_#121316]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-[#F12850] border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-[#666970] mt-3">Loading projects from Edge...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="lb-card border-2 border-[#121316] p-12 text-center max-w-lg mx-auto shadow-[0_4px_0_#121316]">
          <div className="w-16 h-16 rounded-3xl bg-[#F4F4F0] border-2 border-[#121316] flex items-center justify-center mx-auto mb-4 text-2xl shadow-[0_2px_0_#121316]">
            📦
          </div>
          <h3 className="text-lg font-black text-[#121316]">No projects found</h3>
          <p className="text-xs text-[#666970] mt-1 font-medium mb-6">
            Create your first website project to deploy files or generate an AI agent token.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="lb-btn-coral text-xs font-bold px-6 py-2.5 shadow-[0_3px_0_#b31634]"
          >
            <Plus className="w-4 h-4" />
            Create Project Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(p => {
            const hasCustomDomain = Boolean(p.customDomain);
            const latestDeploy = p.deployments[0];

            return (
              <div
                key={p.id}
                className="lb-card border-2 border-[#121316] p-6 shadow-[0_4px_0_#121316] flex flex-col justify-between group hover:-translate-y-1 transition-all"
              >
                <div>
                  {/* Card Header & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2AB09C]/15 text-[#2AB09C] border border-[#2AB09C]/30 text-[11px] font-extrabold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2AB09C] pulse-dot" />
                      {p.status}
                    </span>

                    <button
                      onClick={e => handleDeleteProject(p.id, e)}
                      title="Delete Project"
                      className="p-1.5 rounded-lg text-[#666970] hover:text-[#F12850] hover:bg-[#F12850]/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Project Name */}
                  <h3 className="text-lg font-black text-[#121316] group-hover:text-[#F12850] transition-colors line-clamp-1 mb-1.5">
                    {p.name}
                  </h3>

                  {/* Domain preview link */}
                  <div className="flex items-center gap-1.5 text-xs font-mono mb-4 text-[#666970]">
                    <Globe className="w-3.5 h-3.5 text-[#2AB09C] shrink-0" />
                    <span className="truncate font-bold text-[#121316]">
                      {p.customDomain || `${p.subdomain}.hosterplus.live`}
                    </span>
                    {hasCustomDomain && (
                      <span className="text-[10px] font-sans font-bold bg-[#FFE100] text-[#121316] px-1.5 py-0.2 rounded border border-[#121316]">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Deployment badge */}
                  <div className="p-3 rounded-2xl bg-[#F4F4F0] border border-[#E2E2DC] space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[#121316] font-bold">
                      <span>Latest Deploy:</span>
                      <span className="bg-[#FFFFFF] border border-[#E2E2DC] px-2 py-0.5 rounded-md font-mono text-[11px]">
                        v{latestDeploy?.version || 1}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#666970] truncate">
                      {latestDeploy?.uploadedBy || 'Manual Upload'}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 pt-4 border-t border-[#E2E2DC] flex items-center justify-between gap-2">
                  <Link
                    to={`/project/${p.id}`}
                    className="lb-btn-primary text-xs font-bold px-4 py-2 flex-1"
                  >
                    <span>Manage Studio</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/project/${p.id}/tokens`}
                    title="AI Agent Tokens"
                    className="p-2 rounded-full border-2 border-[#121316] bg-[#FAFAF7] hover:bg-[#FFE100] transition-all shadow-[0_2px_0_#121316]"
                  >
                    <Bot className="w-4 h-4 text-[#121316]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal (LensBooth style) */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-3xl border-2 border-[#121316] p-7 shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
            <h3 className="text-xl font-black text-[#121316] mb-1">
              Create New Project
            </h3>
            <p className="text-xs text-[#666970] font-medium mb-5">
              Set a name and choose an optional starter template.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#121316] mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. My Next.js Portfolio"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#121316] bg-[#F4F4F0] text-sm font-bold text-[#121316] placeholder-[#888] focus:outline-none focus:bg-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#121316] mb-1.5">
                  Starter Template
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'portfolio', label: 'Portfolio', icon: '🎨' },
                    { id: 'react', label: 'React SPA', icon: '⚛️' },
                    { id: 'blank', label: 'Blank HTML', icon: '📄' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTemplate(t.id as any)}
                      className={`p-2.5 rounded-xl border-2 text-center text-xs font-bold transition-all ${
                        selectedTemplate === t.id
                          ? 'border-[#121316] bg-[#FFE100] text-[#121316] shadow-[0_2px_0_#121316]'
                          : 'border-[#E2E2DC] bg-[#FFFFFF] text-[#666970] hover:border-[#121316]'
                      }`}
                    >
                      <div className="text-base mb-0.5">{t.icon}</div>
                      <div>{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#E2E2DC]">
                <button
                  type="submit"
                  disabled={creating || !newName.trim()}
                  className="flex-1 lb-btn-coral text-xs font-bold py-2.5 shadow-[0_3px_0_#b31634] disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="lb-btn-secondary text-xs font-bold px-5 py-2.5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
