import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import type { User } from '../App'
import {
  ArrowLeft, Upload, Bot, Globe, Shield, Clock,
  ExternalLink, Check, AlertCircle, Loader2, ChevronRight, File, Trash2
} from 'lucide-react'

interface Project {
  id: string; name: string; subdomain: string; customDomain?: string
  status: string; sslEnabled: boolean; filesPath: string
  deployments: { id: string; version: number; uploadedBy: string; fileCount: number; createdAt: string }[]
}

interface Props { user: User }

export default function ProjectPage({ user: _user }: Props) {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; siteUrl?: string } | null>(null)
  const [customDomain, setCustomDomain] = useState('')
  const [domainLoading, setDomainLoading] = useState(false)
  const [domainMsg, setDomainMsg] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'domain' | 'history'>('upload')

  const fetchProject = () => {
    fetch(`http://localhost:4000/api/projects/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setProject(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchProject() }, [id])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length || !id) return
    setUploading(true)
    setUploadResult(null)
    const form = new FormData()
    acceptedFiles.forEach(f => form.append('files', f))
    try {
      const res = await fetch(`http://localhost:4000/api/upload/${id}`, {
        method: 'POST', credentials: 'include', body: form,
      })
      const data = await res.json()
      setUploadResult({ success: res.ok, message: data.message || data.error, siteUrl: data.siteUrl })
      if (res.ok) fetchProject()
    } catch {
      setUploadResult({ success: false, message: 'Upload failed. Try again.' })
    }
    setUploading(false)
  }, [id])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    disabled: uploading,
  })

  const addDomain = async () => {
    if (!customDomain.trim()) return
    setDomainLoading(true)
    setDomainMsg(null)
    const res = await fetch(`http://localhost:4000/api/domains/${id}`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: customDomain.trim() }),
    })
    const data = await res.json()
    setDomainMsg(res.ok ? `✅ ${data.message}` : `❌ ${data.error}`)
    if (res.ok) fetchProject()
    setDomainLoading(false)
  }

  const removeDomain = async () => {
    if (!confirm('Remove custom domain?')) return
    await fetch(`http://localhost:4000/api/domains/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchProject()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
    </div>
  )

  if (!project) return (
    <div className="text-center py-20">
      <p className="text-gray-400">Project not found</p>
      <Link to="/dashboard" className="text-violet-400 mt-4 inline-block">← Back to dashboard</Link>
    </div>
  )

  const siteUrl = project.customDomain ? `https://${project.customDomain}` : null

  return (
    <div>
      {/* Back + Header */}
      <div className="flex items-start gap-4 mb-8">
        <Link to="/dashboard" className="mt-1 p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black text-white">{project.name}</h1>
            <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${
              project.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
            }`}>
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <Globe className="w-3.5 h-3.5 text-gray-500" />
            {siteUrl ? (
              <a href={siteUrl} target="_blank" rel="noreferrer"
                className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                {project.customDomain}
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-sm text-gray-500 italic">No domain yet — add one in the Domain tab</span>
            )}
          </div>
        </div>

        {/* AI Token button */}
        <Link to={`/project/${id}/tokens`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium hover:bg-violet-500/20 transition-all">
          <Bot className="w-4 h-4" /> AI Tokens <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-white/[0.03] rounded-xl border border-white/5 w-fit">
        {(['upload', 'domain', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}>
            {tab === 'upload' ? '📁 Upload' : tab === 'domain' ? '🌐 Domain' : '📋 History'}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div {...getRootProps()}
            className={`relative flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed transition-all cursor-pointer
              ${isDragActive ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'}
              ${uploading ? 'pointer-events-none opacity-60' : ''}`}>
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
                <p className="text-white font-semibold">Deploying your files...</p>
                <p className="text-gray-400 text-sm">This will only take a moment</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center px-8">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-violet-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {isDragActive ? 'Drop files to deploy!' : 'Drag & drop files here'}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">or <span className="text-violet-400">click to browse</span> — supports all file types & folders</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1"><File className="w-3 h-3" /> HTML, CSS, JS, images</span>
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Up to 500 files</span>
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> 50MB per file</span>
                </div>
              </div>
            )}
          </div>

          {uploadResult && (
            <div className={`flex items-start gap-3 p-4 rounded-xl border ${
              uploadResult.success ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
            }`}>
              {uploadResult.success ? <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
              <div>
                <p className={`font-semibold ${uploadResult.success ? 'text-emerald-300' : 'text-red-300'}`}>{uploadResult.message}</p>
                {uploadResult.siteUrl && (
                  <a href={uploadResult.siteUrl} target="_blank" rel="noreferrer"
                    className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 mt-1">
                    Visit your site <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Domain Tab */}
      {activeTab === 'domain' && (
        <div className="space-y-6 max-w-lg">
          {/* Custom domain only notice */}
          <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 text-sm text-violet-300 flex items-start gap-2">
            <span className="text-lg">🌐</span>
            <span>Hoster++ uses <strong>custom domains only</strong> — no shared subdomains. Your site goes live on your own domain.</span>
          </div>

          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
            <h3 className="font-bold mb-1 flex items-center gap-2">
              Custom Domain
              {project.sslEnabled && <Shield className="w-4 h-4 text-emerald-400" />}
            </h3>
            <p className="text-gray-400 text-sm mb-3">Point your own domain to this project. SSL is provisioned automatically.</p>

            {project.customDomain ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">{project.customDomain}</span>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-sm">
                  <p className="text-gray-400 font-medium mb-2">Add these DNS records in your registrar:</p>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex gap-4">
                      <span className="text-gray-500 w-16">Type</span>
                      <span className="text-gray-500 w-12">Name</span>
                      <span className="text-gray-500">Value</span>
                    </div>
                    <div className="flex gap-4 text-white">
                      <span className="w-16 text-violet-300">A</span>
                      <span className="w-12">@</span>
                      <span className="text-cyan-300">YOUR_SERVER_IP</span>
                    </div>
                    <div className="flex gap-4 text-white">
                      <span className="w-16 text-violet-300">CNAME</span>
                      <span className="w-12">www</span>
                      <span className="text-cyan-300">{project.customDomain}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs mt-3">⏱ DNS changes can take up to 48 hours to propagate globally.</p>
                </div>
                <button onClick={removeDomain}
                  className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 className="w-4 h-4" /> Remove custom domain
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input type="text" value={customDomain} onChange={e => setCustomDomain(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addDomain()}
                    placeholder="yourdomain.com"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition-all" />
                  <button onClick={addDomain} disabled={domainLoading || !customDomain.trim()}
                    className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 disabled:opacity-50 transition-all">
                    {domainLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                  </button>
                </div>
                {domainMsg && <p className="text-sm text-gray-300">{domainMsg}</p>}
                <p className="text-xs text-gray-600">Enter your domain (e.g. myapp.com). After adding, you'll see DNS instructions.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {project.deployments.length === 0 ? (
            <p className="text-gray-400 text-sm">No deployments yet. Upload your first files!</p>
          ) : (
            project.deployments.map(d => (
              <div key={d.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">
                    v{d.version}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{d.fileCount} files deployed</p>
                    <p className="text-xs text-gray-500">
                      {d.uploadedBy.startsWith('ai-token') ? '🤖 AI Upload' : '👤 Manual Upload'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date(d.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
