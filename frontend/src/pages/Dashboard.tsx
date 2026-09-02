import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../App'
import { Plus, Globe, Clock, Zap, Trash2, ExternalLink } from 'lucide-react'

interface Project {
  id: string
  name: string
  subdomain: string
  customDomain?: string
  status: string
  updatedAt: string
  deployments: { version: number; createdAt: string }[]
}

interface Props { user: User }

export default function Dashboard({ user }: Props) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const fetchProjects = () => {
    fetch('http://localhost:4000/api/projects', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setProjects(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchProjects() }, [])

  const createProject = async () => {
    if (!newName.trim()) return
    setCreating(true)
    const res = await fetch('http://localhost:4000/api/projects', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    })
    if (res.ok) { setNewName(''); setShowCreate(false); fetchProjects() }
    setCreating(false)
  }

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm('Delete this project and all its files?')) return
    await fetch(`http://localhost:4000/api/projects/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchProjects()
  }

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    INACTIVE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    BUILDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    ERROR: 'bg-red-500/20 text-red-300 border-red-500/30',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your hosted projects</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-violet-500/20"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Create New Project</h2>
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createProject()}
              placeholder="Project name (e.g. My Portfolio)"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition-all mb-4"
            />
            <div className="flex gap-3">
              <button onClick={createProject} disabled={creating || !newName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all">
                {creating ? 'Creating...' : 'Create Project'}
              </button>
              <button onClick={() => setShowCreate(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-lg font-bold mb-2">No projects yet</h3>
          <p className="text-gray-400 text-sm mb-6">Create your first project to start hosting</p>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-500 transition-all">
            <Plus className="w-4 h-4" /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <Link key={p.id} to={`/project/${p.id}`}
              className="card-hover group relative p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all">
              <button onClick={e => deleteProject(p.id, e)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium mb-3 ${statusColors[p.status] || statusColors.INACTIVE}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                {p.status}
              </div>
              <h3 className="font-bold text-white mb-1 pr-8">{p.name}</h3>
              <div className="flex items-center gap-1.5 text-xs mb-3">
                <Globe className="w-3 h-3 text-gray-500" />
                {p.customDomain ? (
                  <>
                    <span className="truncate text-violet-400">{p.customDomain}</span>
                    <ExternalLink className="w-3 h-3 shrink-0 text-gray-500" />
                  </>
                ) : (
                  <span className="text-gray-600 italic">No domain — add one in settings</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                <span>{p.deployments[0] ? `v${p.deployments[0].version} · ${new Date(p.deployments[0].createdAt).toLocaleDateString()}` : 'No deployments yet'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
