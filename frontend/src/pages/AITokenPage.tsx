import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { User } from '../App'
import { ArrowLeft, Bot, Plus, Copy, Check, Trash2, Eye, EyeOff, Clock, AlertCircle, Loader2, Terminal } from 'lucide-react'

interface TokenInfo {
  id: string; name: string; projectId: string; projectName: string
  expiresAt: string; usedAt?: string; revoked: boolean
  createdAt: string; tokenPreview: string
}

interface RevealedToken {
  [id: string]: string
}

interface Props { user: User }

export default function AITokenPage({ user: _user }: Props) {
  const { id } = useParams<{ id: string }>()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [tokenName, setTokenName] = useState('')
  const [expiresIn, setExpiresIn] = useState('1h')
  const [newToken, setNewToken] = useState<{ token: string; usage: { example: string; endpoint: string } } | null>(null)
  const [revealed, setRevealed] = useState<RevealedToken>({})
  const [copied, setCopied] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<string | null>(null)

  const fetchTokens = () => {
    fetch(`http://localhost:4000/api/tokens?projectId=${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setTokens(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchTokens() }, [id])

  const createToken = async () => {
    if (!tokenName.trim() || !id) return
    setCreating(true)
    const res = await fetch('http://localhost:4000/api/tokens', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: id, name: tokenName.trim(), expiresIn }),
    })
    const data = await res.json()
    if (res.ok) {
      setNewToken(data)
      setTokenName('')
      fetchTokens()
    }
    setCreating(false)
  }

  const revealToken = async (tokenId: string) => {
    if (revealed[tokenId]) {
      setRevealed(prev => { const n = { ...prev }; delete n[tokenId]; return n })
      return
    }
    const res = await fetch(`http://localhost:4000/api/tokens/${tokenId}/reveal`, { credentials: 'include' })
    const data = await res.json()
    if (res.ok) setRevealed(prev => ({ ...prev, [tokenId]: data.token }))
  }

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const revokeToken = async (tokenId: string) => {
    if (!confirm('Revoke this token? AI agents using it will lose access immediately.')) return
    setRevoking(tokenId)
    await fetch(`http://localhost:4000/api/tokens/${tokenId}`, { method: 'DELETE', credentials: 'include' })
    fetchTokens()
    setRevoking(null)
  }

  const isExpired = (exp: string) => new Date(exp) < new Date()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to={`/project/${id}`} className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" /> AI Upload Tokens
          </h1>
          <p className="text-gray-400 text-sm mt-1">Generate tokens for AI agents to deploy files automatically</p>
        </div>
      </div>

      {/* How it works */}
      <div className="p-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 mb-6">
        <h3 className="font-bold text-cyan-300 mb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4" /> How AI Token Upload Works
        </h3>
        <ol className="text-sm text-gray-300 space-y-1.5">
          <li>1. Generate a token below and give it an expiry time</li>
          <li>2. Copy the token and give it to your AI agent (Claude, GPT, Gemini, etc.)</li>
          <li>3. The AI sends a POST request with your files — and they're instantly deployed!</li>
          <li>4. No login required for the AI. The token is all it needs.</li>
        </ol>
      </div>

      {/* Create token form */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] mb-6">
        <h3 className="font-bold mb-4">Generate New AI Token</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={tokenName} onChange={e => setTokenName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createToken()}
            placeholder='Token name (e.g. "Claude Upload", "GPT Deploy")'
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition-all" />
          <select value={expiresIn} onChange={e => setExpiresIn(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500 transition-all">
            <option value="1h">1 hour</option>
            <option value="6h">6 hours</option>
            <option value="24h">24 hours</option>
            <option value="7d">7 days</option>
          </select>
          <button onClick={createToken} disabled={creating || !tokenName.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all whitespace-nowrap">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Generate Token
          </button>
        </div>
      </div>

      {/* Newly generated token display */}
      {newToken && (
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4" /> Token Generated! Copy it now.
            </h3>
            <button onClick={() => setNewToken(null)} className="text-gray-500 hover:text-gray-300 text-sm">Dismiss</button>
          </div>
          <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-violet-300 break-all mb-3 relative">
            {newToken.token}
            <button onClick={() => copyText(newToken.token, 'new')}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
              {copied === 'new' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-3 font-medium">Example curl command to give your AI:</p>
          <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-gray-300 break-all relative">
            <pre className="whitespace-pre-wrap">{newToken.usage.example}</pre>
            <button onClick={() => copyText(newToken.usage.example, 'curl')}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
              {copied === 'curl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
            </button>
          </div>
        </div>
      )}

      {/* Tokens list */}
      <h3 className="font-bold mb-3 text-gray-300">Active Tokens</h3>
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading tokens...
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Bot className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No tokens yet. Generate one above to let AI deploy here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tokens.map(t => {
            const expired = isExpired(t.expiresAt)
            const dead = t.revoked || expired
            return (
              <div key={t.id} className={`p-4 rounded-xl border transition-all ${dead ? 'border-white/5 bg-white/[0.01] opacity-50' : 'border-white/10 bg-white/[0.02]'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm">{t.name}</span>
                      {t.revoked && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs border border-red-500/30">Revoked</span>
                      )}
                      {!t.revoked && expired && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-xs border border-orange-500/30">Expired</span>
                      )}
                      {!dead && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30">Active</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      Expires: {new Date(t.expiresAt).toLocaleString()}
                      {t.usedAt && <span className="ml-2">· Last used: {new Date(t.usedAt).toLocaleString()}</span>}
                    </div>

                    {/* Token preview / reveal */}
                    {!dead && (
                      <div className="mt-2 flex items-center gap-2">
                        <code className="text-xs text-violet-300/60 font-mono truncate max-w-[300px]">
                          {revealed[t.id] || t.tokenPreview}
                        </code>
                        <button onClick={() => revealToken(t.id)}
                          className="text-gray-500 hover:text-gray-300 transition-colors">
                          {revealed[t.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        {revealed[t.id] && (
                          <button onClick={() => copyText(revealed[t.id], t.id)}
                            className="text-gray-500 hover:text-gray-300 transition-colors">
                            {copied === t.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {!t.revoked && (
                    <button onClick={() => revokeToken(t.id)} disabled={revoking === t.id}
                      className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0">
                      {revoking === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Warning */}
      <div className="mt-6 flex items-start gap-2 text-xs text-gray-500">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>Keep your tokens secret. Anyone with a valid token can deploy files to this project. Revoke unused tokens immediately.</span>
      </div>
    </div>
  )
}
