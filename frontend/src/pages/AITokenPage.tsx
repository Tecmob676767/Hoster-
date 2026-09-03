import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { User, AIToken } from '../services/store';
import { api } from '../services/api';
import {
  ArrowLeft, Bot, Plus, Copy, Check, Trash2, Eye, EyeOff, Clock,
  Loader2
} from 'lucide-react';

interface Props {
  user: User;
}

export default function AITokenPage({ user: _user }: Props) {
  const { id } = useParams<{ id: string }>();
  const [tokens, setTokens] = useState<AIToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [expiresIn, setExpiresIn] = useState('7d');
  const [snippetTab, setSnippetTab] = useState<'curl' | 'python' | 'node'>('curl');
  const [newToken, setNewToken] = useState<{ token: AIToken; usage: { example: string } } | null>(null);
  const [revealed, setRevealed] = useState<{ [id: string]: boolean }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchTokens = async () => {
    if (!id) return;
    setLoading(true);
    const data = await api.getTokens(id);
    setTokens(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTokens();
  }, [id]);

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenName.trim() || !id) return;
    setCreating(true);
    const res = await api.createToken(id, tokenName.trim(), expiresIn);
    setNewToken(res);
    setTokenName('');
    await fetchTokens();
    setCreating(false);
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRevoke = async (tokenId: string) => {
    if (!confirm('Revoke this token? AI agents using it will immediately lose upload access.')) return;
    await api.revokeToken(tokenId);
    await fetchTokens();
  };

  const getSnippets = (tokenStr: string) => {
    return {
      curl: `curl -X POST "https://hosterplus.app/api/upload/${id || 'PROJECT_ID'}" \\
  -H "Authorization: Bearer ${tokenStr}" \\
  -F "files[]=@index.html" \\
  -F "files[]=@style.css" \\
  -F "files[]=@app.js"`,
      python: `import requests

url = "https://hosterplus.app/api/upload/${id || 'PROJECT_ID'}"
headers = {"Authorization": "Bearer ${tokenStr}"}
files = [
    ('files', ('index.html', open('index.html', 'rb'), 'text/html')),
    ('files', ('style.css', open('style.css', 'rb'), 'text/css')),
]

response = requests.post(url, headers=headers, files=files)
print(response.json())`,
      node: `const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

const form = new FormData();
form.append('files', fs.createReadStream('index.html'));
form.append('files', fs.createReadStream('style.css'));

fetch('https://hosterplus.app/api/upload/${id || 'PROJECT_ID'}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${tokenStr}',
    ...form.getHeaders()
  },
  body: form
})
.then(res => res.json())
.then(data => console.log('Deployed:', data));`,
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E2DC]">
        <div className="flex items-start gap-3">
          <Link
            to={`/project/${id}`}
            className="p-2 rounded-2xl border-2 border-[#121316] bg-[#FFFFFF] hover:bg-[#F4F4F0] text-[#121316] shadow-[0_2px_0_#121316] transition-all shrink-0 mt-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#666970] mb-0.5">
              <Bot className="w-3.5 h-3.5 text-[#FF6DE4]" />
              AI Headless Automation
            </div>
            <h1 className="text-2xl font-black text-[#121316]">AI Upload Tokens</h1>
            <p className="text-xs text-[#666970] font-medium mt-0.5">
              Generate secure API tokens so AI agents can deploy directly to your website.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Guide Box (LensBooth styled) */}
      <div className="lb-card border-2 border-[#121316] bg-[#FFFFFF] p-6 shadow-[0_4px_0_#121316]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-xl bg-[#FF6DE4] text-white flex items-center justify-center font-bold text-xs shadow-[0_2px_0_#c93bb0]">
            ⚡
          </div>
          <h3 className="text-sm font-black text-[#121316] uppercase tracking-wider">
            How Autonomous AI Deployments Work
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-[#666970] pt-1">
          <div className="p-3.5 rounded-2xl bg-[#F4F4F0] border border-[#E2E2DC] space-y-1">
            <div className="font-bold text-[#121316]">1. Generate a Token</div>
            <p>Pick a lifetime and name (e.g. "Claude Code Assistant").</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F4F4F0] border border-[#E2E2DC] space-y-1">
            <div className="font-bold text-[#121316]">2. Hand to Your AI Agent</div>
            <p>Paste the cURL command into Cursor, ChatGPT, or Claude Code prompt.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F4F4F0] border border-[#E2E2DC] space-y-1">
            <div className="font-bold text-[#121316]">3. Live HTTPS Broadcast</div>
            <p>The AI deploys your updated build in 1.8s with zero login prompts.</p>
          </div>
        </div>
      </div>

      {/* Generate Token Form */}
      <div className="lb-card border-2 border-[#121316] bg-[#FFFFFF] p-6 shadow-[0_4px_0_#121316] space-y-4">
        <h3 className="text-base font-black text-[#121316]">
          Generate New AI Token
        </h3>

        <form onSubmit={handleCreateToken} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="text"
              required
              value={tokenName}
              onChange={e => setTokenName(e.target.value)}
              placeholder="e.g. Claude 3.7 Sonnet Deployer"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#121316] bg-[#F4F4F0] text-xs font-bold text-[#121316] placeholder-[#888] focus:outline-none focus:bg-[#FFFFFF]"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={expiresIn}
              onChange={e => setExpiresIn(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-[#121316] bg-[#F4F4F0] text-xs font-bold text-[#121316] focus:outline-none focus:bg-[#FFFFFF]"
            >
              <option value="1h">Expires in 1 Hour</option>
              <option value="6h">Expires in 6 Hours</option>
              <option value="24h">Expires in 24 Hours</option>
              <option value="7d">Expires in 7 Days</option>
              <option value="30d">Expires in 30 Days</option>
              <option value="never">Never Expires (Permanent)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={creating || !tokenName.trim()}
              className="w-full lb-btn-coral text-xs font-bold py-2.5 shadow-[0_3px_0_#b31634] disabled:opacity-50"
            >
              {creating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate Token</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Newly Created Token Display */}
      {newToken && (
        <div className="p-6 rounded-3xl border-2 border-[#121316] bg-[#FFE100] shadow-[0_4px_0_#121316] space-y-4 animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#121316]" />
              <h3 className="text-base font-black text-[#121316]">
                Token Generated Successfully!
              </h3>
            </div>
            <button
              onClick={() => setNewToken(null)}
              className="text-xs font-bold text-[#121316] underline"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs font-bold text-[#121316]">
            Copy this token now. It grants permission to upload files directly to this project.
          </p>

          <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border-2 border-[#121316] flex items-center justify-between gap-3">
            <code className="text-xs font-mono font-bold text-[#F12850] truncate">
              {newToken.token.token}
            </code>
            <button
              onClick={() => handleCopy(newToken.token.token, 'new_tok')}
              className="lb-btn-primary text-xs font-bold px-3.5 py-1.5 shrink-0"
            >
              {copiedKey === 'new_tok' ? <Check className="w-3.5 h-3.5 text-[#2AB09C]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'new_tok' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Quick Snippets */}
          <div>
            <div className="flex gap-2 mb-2">
              {(['curl', 'python', 'node'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSnippetTab(tab)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-all ${
                    snippetTab === tab
                      ? 'bg-[#121316] text-white'
                      : 'bg-[#FFFFFF] text-[#121316] border border-[#121316]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative p-4 rounded-2xl bg-[#121316] text-[#FAFAF7] font-mono text-xs overflow-x-auto">
              <pre>{getSnippets(newToken.token.token)[snippetTab]}</pre>
              <button
                onClick={() => handleCopy(getSnippets(newToken.token.token)[snippetTab], 'snippet')}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-white transition-colors"
                title="Copy snippet"
              >
                {copiedKey === 'snippet' ? <Check className="w-3.5 h-3.5 text-[#2AB09C]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Tokens List */}
      <div className="lb-card border-2 border-[#121316] p-7 shadow-[0_4px_0_#121316] space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E2DC]">
          <h3 className="text-sm font-black text-[#121316] uppercase tracking-wider">
            Active Tokens ({tokens.length})
          </h3>
          <span className="text-xs font-mono text-[#666970]">
            Project: {id}
          </span>
        </div>

        {loading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-xs font-bold text-[#666970]">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading tokens...
          </div>
        ) : tokens.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#666970]">
            No tokens generated yet. Generate one above for your AI agent.
          </div>
        ) : (
          <div className="space-y-3">
            {tokens.map(t => {
              const isRevoked = t.revoked;
              const isExpired = new Date(t.expiresAt) < new Date();
              const isDead = isRevoked || isExpired;
              const isShown = revealed[t.id];

              return (
                <div
                  key={t.id}
                  className={`p-4 rounded-2xl border-2 border-[#121316] transition-all ${
                    isDead
                      ? 'bg-[#F4F4F0] opacity-60'
                      : 'bg-[#FFFFFF] shadow-[0_2px_0_#121316]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#121316]">{t.name}</span>
                        {isRevoked ? (
                          <span className="text-[10px] font-bold bg-[#F12850]/15 text-[#F12850] px-2 py-0.2 rounded-full">
                            Revoked
                          </span>
                        ) : isExpired ? (
                          <span className="text-[10px] font-bold bg-[#FFE100] text-[#121316] px-2 py-0.2 rounded-full border border-[#121316]">
                            Expired
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-[#2AB09C]/15 text-[#2AB09C] px-2 py-0.2 rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-[#666970]">
                        <span>{isShown ? t.token : t.tokenPreview}</span>
                        {!isDead && (
                          <>
                            <button
                              onClick={() => setRevealed(prev => ({ ...prev, [t.id]: !prev[t.id] }))}
                              className="text-[#121316] hover:text-[#F12850] transition-colors"
                              title={isShown ? 'Hide' : 'Reveal'}
                            >
                              {isShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleCopy(t.token, t.id)}
                              className="text-[#121316] hover:text-[#F12850] transition-colors"
                              title="Copy Token"
                            >
                              {copiedKey === t.id ? <Check className="w-3.5 h-3.5 text-[#2AB09C]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </>
                        )}
                      </div>

                      <div className="text-[11px] text-[#666970] flex items-center gap-1.5 pt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Expires: {new Date(t.expiresAt).toLocaleDateString()}</span>
                        {t.usedAt && <span>• Last used: {new Date(t.usedAt).toLocaleDateString()}</span>}
                      </div>
                    </div>

                    {!isRevoked && (
                      <button
                        onClick={() => handleRevoke(t.id)}
                        className="p-2 rounded-xl text-[#666970] hover:text-[#F12850] hover:bg-[#F12850]/10 transition-colors self-start sm:self-auto"
                        title="Revoke Token"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
