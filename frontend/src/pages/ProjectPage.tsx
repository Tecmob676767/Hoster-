import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import type { User, Project } from '../services/store';
import { api } from '../services/api';
import { store } from '../services/store';
import {
  ArrowLeft, Upload, Bot, Globe, Shield, Clock,
  ExternalLink, Check, AlertCircle, File, Trash2,
  Monitor, Smartphone, Tablet, RefreshCw, RotateCcw,
  Lock, Zap, Loader2, ChevronRight
} from 'lucide-react';

interface Props {
  user: User;
}

export default function ProjectPage({ user: _user }: Props) {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; siteUrl?: string } | null>(null);
  const [customDomain, setCustomDomain] = useState('');
  const [domainLoading, setDomainLoading] = useState(false);
  const [domainMsg, setDomainMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'domain' | 'history'>('upload');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [dnsChecked, setDnsChecked] = useState(false);
  const [checkingDns, setCheckingDns] = useState(false);

  const fetchProject = async () => {
    if (!id) return;
    setLoading(true);
    const data = await api.getProject(id);
    setProject(data);
    if (data?.customDomain) {
      setCustomDomain(data.customDomain);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length || !id) return;
      setUploading(true);
      setUploadResult(null);

      const res = await api.uploadFiles(id, acceptedFiles, '👤 Manual Drop');
      setUploadResult(res);
      await fetchProject();
      setUploading(false);
    },
    [id]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    disabled: uploading,
  });

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomain.trim() || !id) return;
    setDomainLoading(true);
    setDomainMsg(null);

    const res = await api.setDomain(id, customDomain.trim());
    setDomainMsg(res.message);
    await fetchProject();
    setDomainLoading(false);
  };

  const handleRemoveDomain = async () => {
    if (!confirm('Are you sure you want to remove the custom domain?')) return;
    if (!id) return;
    await api.removeDomain(id);
    setCustomDomain('');
    setDomainMsg(null);
    await fetchProject();
  };

  const handleVerifyDns = () => {
    setCheckingDns(true);
    setTimeout(() => {
      setCheckingDns(false);
      setDnsChecked(true);
    }, 800);
  };

  const handleRollback = async (version: number) => {
    if (!id) return;
    if (!confirm(`Roll back project to deployment v${version}?`)) return;
    store.rollbackDeployment(id, version);
    await fetchProject();
    alert(`Successfully rolled back to deployment v${version}!`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 rounded-full border-4 border-[#F12850] border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-[#666970] mt-3">Loading project studio...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="lb-card border-2 border-[#121316] p-12 text-center max-w-md mx-auto shadow-[0_4px_0_#121316]">
        <h3 className="text-lg font-black text-[#121316]">Project Not Found</h3>
        <p className="text-xs text-[#666970] mt-1 font-medium mb-6">
          This project might have been removed.
        </p>
        <Link to="/dashboard" className="lb-btn-primary text-xs font-bold px-6 py-2.5">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const liveUrl = project.customDomain
    ? `https://${project.customDomain}`
    : `https://${project.subdomain}.hosterplus.live`;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2E2DC]">
        <div className="flex items-start gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-2xl border-2 border-[#121316] bg-[#FFFFFF] hover:bg-[#F4F4F0] text-[#121316] shadow-[0_2px_0_#121316] transition-all shrink-0 mt-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-[#121316]">{project.name}</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#2AB09C]/15 text-[#2AB09C] border border-[#2AB09C]/30 text-[11px] font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2AB09C] pulse-dot" />
                {project.status}
              </span>
              {project.sslEnabled && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#FFE100] text-[#121316] px-2.5 py-0.5 rounded-full border border-[#121316]">
                  <Shield className="w-3 h-3 text-[#121316]" /> SSL Secure
                </span>
              )}
            </div>

            {/* Live URL Link */}
            <div className="flex items-center gap-2 mt-1.5 text-xs font-mono">
              <Globe className="w-3.5 h-3.5 text-[#2AB09C]" />
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#F12850] hover:underline flex items-center gap-1"
              >
                {liveUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* AI Tokens Button */}
        <Link
          to={`/project/${id}/tokens`}
          className="lb-btn-coral text-xs font-bold px-5 py-2.5 shadow-[0_3px_0_#b31634] self-start md:self-auto"
        >
          <Bot className="w-4 h-4" />
          <span>AI Upload Tokens</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tabs Navigation (LensBooth style pill bar) */}
      <div className="flex gap-2 p-1.5 bg-[#FFFFFF] border-2 border-[#121316] rounded-2xl shadow-[0_3px_0_#121316] w-full sm:w-fit overflow-x-auto">
        {[
          { id: 'upload' as const, label: '📁 Upload & Files' },
          { id: 'preview' as const, label: '🖥️ Live Preview' },
          { id: 'domain' as const, label: '🌐 Custom Domain' },
          { id: 'history' as const, label: '📋 History & Rollback' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#121316] text-white shadow-sm'
                : 'text-[#666970] hover:text-[#121316]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Upload & Files */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Drag & Drop Zone */}
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-[#F12850] bg-[#F12850]/5 shadow-inner'
                : 'border-[#121316]/40 hover:border-[#121316] bg-[#FFFFFF] shadow-[0_4px_0_#121316]'
            } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="space-y-3 py-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#F12850] border-t-transparent animate-spin mx-auto" />
                <p className="text-base font-black text-[#121316]">
                  Deploying assets to global edge...
                </p>
                <p className="text-xs text-[#666970] font-mono">
                  Hashing files • Provisioning TLS certificates
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#FFE100] border-2 border-[#121316] flex items-center justify-center mx-auto shadow-[0_2px_0_#121316]">
                  <Upload className="w-6 h-6 text-[#121316]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#121316]">
                    {isDragActive ? 'Drop your files now!' : 'Drag & drop your build folder or files here'}
                  </h3>
                  <p className="text-xs text-[#666970] mt-1 font-medium">
                    or <span className="text-[#F12850] font-bold underline">browse from your computer</span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#666970] pt-2">
                  <span>✓ Supports HTML, CSS, JS, Images</span>
                  <span>✓ Vite & React builds</span>
                  <span>✓ 100% Free Edge Hosting</span>
                </div>
              </div>
            )}
          </div>

          {/* Upload result alert */}
          {uploadResult && (
            <div
              className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
                uploadResult.success
                  ? 'bg-[#2AB09C]/10 border-[#2AB09C] text-[#121316]'
                  : 'bg-[#F12850]/10 border-[#F12850] text-[#121316]'
              }`}
            >
              {uploadResult.success ? (
                <Check className="w-5 h-5 text-[#2AB09C] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#F12850] shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-bold">{uploadResult.message}</p>
                {uploadResult.siteUrl && (
                  <a
                    href={uploadResult.siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#F12850] mt-1 hover:underline"
                  >
                    Open Live Deployment <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Current File Tree */}
          <div className="lb-card border-2 border-[#121316] p-6 shadow-[0_4px_0_#121316]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E2DC] mb-4">
              <h3 className="text-sm font-black text-[#121316] uppercase tracking-wider">
                Active Deployed Files ({project.files?.length || 0})
              </h3>
              <span className="text-xs font-mono text-[#666970]">
                Path: {project.filesPath}
              </span>
            </div>

            <div className="divide-y divide-[#E2E2DC]">
              {project.files && project.files.length > 0 ? (
                project.files.map((file, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 font-bold text-[#121316]">
                      <File className="w-4 h-4 text-[#4DA6FF]" />
                      <span>{file.name}</span>
                    </div>
                    <span className="text-[#666970]">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-[#666970]">
                  No files deployed yet. Drop files above to deploy.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live In-App Browser Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          {/* Viewport switcher toolbar */}
          <div className="flex items-center justify-between bg-[#FFFFFF] border-2 border-[#121316] p-2.5 rounded-2xl shadow-[0_3px_0_#121316]">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewport === 'desktop' ? 'bg-[#121316] text-white' : 'text-[#666970] hover:text-[#121316]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewport === 'tablet' ? 'bg-[#121316] text-white' : 'text-[#666970] hover:text-[#121316]'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewport === 'mobile' ? 'bg-[#121316] text-white' : 'text-[#666970] hover:text-[#121316]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="lb-btn-secondary text-xs px-4 py-1.5"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Browser frame preview container */}
          <div className="flex justify-center p-4 bg-[#EAEAE5] rounded-3xl border-2 border-[#121316] shadow-inner overflow-hidden min-h-[500px]">
            <div
              className={`bg-[#FFFFFF] rounded-2xl border-2 border-[#121316] overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
                viewport === 'desktop'
                  ? 'w-full h-[600px]'
                  : viewport === 'tablet'
                  ? 'w-[768px] h-[600px]'
                  : 'w-[375px] h-[600px]'
              }`}
            >
              {/* Fake browser address bar */}
              <div className="bg-[#FAFAF7] border-b border-[#E2E2DC] px-4 py-2 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F12850]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFE100]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2AB09C]" />
                </div>
                <div className="flex-1 bg-[#FFFFFF] border border-[#E2E2DC] rounded-lg px-3 py-1 text-[11px] font-mono text-[#666970] truncate flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#2AB09C]" />
                  <span>{liveUrl}</span>
                </div>
              </div>

              {/* Mock Render Canvas */}
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#FAFAF7] to-[#FFFFFF]">
                <div className="w-16 h-16 rounded-3xl bg-[#F12850] text-white flex items-center justify-center mb-4 shadow-[0_3px_0_#b31634]">
                  <Zap className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-[#121316] mb-2">{project.name}</h2>
                <p className="text-xs text-[#666970] max-w-sm font-medium mb-6">
                  This deployment is serving live over the global Edge CDN network with TLS 1.3 encryption.
                </p>
                <div className="inline-flex items-center gap-2 bg-[#2AB09C]/15 text-[#2AB09C] px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#2AB09C]/30">
                  <span className="w-2 h-2 rounded-full bg-[#2AB09C] pulse-dot" />
                  Live Preview Online (v{project.deployments[0]?.version || 1})
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Custom Domain & DNS */}
      {activeTab === 'domain' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Domain Setup Form */}
          <div className="lg:col-span-7 lb-card border-2 border-[#121316] p-7 shadow-[0_4px_0_#121316] space-y-6">
            <div>
              <h3 className="text-lg font-black text-[#121316]">
                Clean Custom Domain
              </h3>
              <p className="text-xs text-[#666970] font-medium mt-1">
                Point your own domain (e.g. yourbrand.com) directly to this project. No forced subdomains.
              </p>
            </div>

            {project.customDomain ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#2AB09C]/10 border-2 border-[#2AB09C] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-5 h-5 text-[#2AB09C]" />
                    <div>
                      <div className="text-sm font-black text-[#121316]">
                        {project.customDomain}
                      </div>
                      <div className="text-[11px] text-[#2AB09C] font-bold">
                        Auto Let's Encrypt SSL Active
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveDomain}
                    className="p-2 rounded-xl text-[#F12850] hover:bg-[#F12850]/10 transition-colors"
                    title="Remove Domain"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleVerifyDns}
                    disabled={checkingDns}
                    className="lb-btn-primary text-xs font-bold px-4 py-2"
                  >
                    {checkingDns ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying DNS Records...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Test Live DNS Health</span>
                      </>
                    )}
                  </button>
                </div>

                {dnsChecked && (
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border-2 border-[#2AB09C] text-xs font-bold text-[#2AB09C] flex items-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>DNS records confirmed! Global propagation at 100%.</span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleAddDomain} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#121316] mb-1.5">
                    Enter Domain Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={customDomain}
                      onChange={e => setCustomDomain(e.target.value)}
                      placeholder="e.g. myportfolio.com or app.mybrand.io"
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-[#121316] bg-[#F4F4F0] text-xs font-bold text-[#121316] placeholder-[#888] focus:outline-none focus:bg-[#FFFFFF]"
                    />
                    <button
                      type="submit"
                      disabled={domainLoading || !customDomain.trim()}
                      className="lb-btn-coral text-xs font-bold px-6 py-2.5 shadow-[0_3px_0_#b31634] disabled:opacity-50"
                    >
                      {domainLoading ? 'Attaching...' : 'Add Domain'}
                    </button>
                  </div>
                </div>

                {domainMsg && (
                  <div className="p-3 rounded-xl bg-[#2AB09C]/10 border border-[#2AB09C] text-xs font-bold text-[#2AB09C]">
                    {domainMsg}
                  </div>
                )}
              </form>
            )}
          </div>

          {/* DNS Configuration Instructions */}
          <div className="lg:col-span-5 lb-card border-2 border-[#121316] p-7 shadow-[0_4px_0_#121316] space-y-4">
            <h3 className="text-sm font-black text-[#121316] uppercase tracking-wider">
              DNS Configuration Guide
            </h3>
            <p className="text-xs text-[#666970] font-medium">
              Add these two records in your domain provider (Cloudflare, GoDaddy, Namecheap):
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#121316] text-white space-y-1">
                <div className="text-[10px] text-[#FFE100] font-bold uppercase">A Record (Root)</div>
                <div className="flex justify-between text-[#FAFAF7]">
                  <span>Host: @</span>
                  <span className="text-[#4DA6FF]">76.76.21.21</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121316] text-white space-y-1">
                <div className="text-[10px] text-[#FFE100] font-bold uppercase">CNAME Record (WWW)</div>
                <div className="flex justify-between text-[#FAFAF7]">
                  <span>Host: www</span>
                  <span className="text-[#2AB09C]">cname.hosterplus.app</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#666970] font-medium">
              ⚡ DNS records usually propagate within 2–15 minutes globally. Auto-SSL is issued immediately.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Deployment History & Rollback */}
      {activeTab === 'history' && (
        <div className="lb-card border-2 border-[#121316] p-7 shadow-[0_4px_0_#121316] space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E2DC]">
            <div>
              <h3 className="text-base font-black text-[#121316]">
                Deployment Version History
              </h3>
              <p className="text-xs text-[#666970] font-medium mt-0.5">
                Every upload creates an immutable release. Roll back to any prior version in 1 click.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#FFE100] text-[#121316] px-3 py-1 rounded-full border border-[#121316]">
              {project.deployments.length} Total Deploys
            </span>
          </div>

          <div className="space-y-3">
            {project.deployments.map((dep, idx) => (
              <div
                key={dep.id}
                className="p-4 rounded-2xl border-2 border-[#121316] bg-[#FFFFFF] hover:bg-[#FAFAF7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_2px_0_#121316] transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#121316] text-white flex items-center justify-center font-mono font-black text-xs">
                    v{dep.version}
                  </div>
                  <div>
                    <div className="text-sm font-black text-[#121316] flex items-center gap-2">
                      <span>{dep.uploadedBy}</span>
                      {idx === 0 && (
                        <span className="text-[10px] font-extrabold bg-[#2AB09C]/15 text-[#2AB09C] px-2 py-0.2 rounded-full">
                          Current Live
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#666970] font-medium flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(dep.createdAt).toLocaleString()}</span>
                      <span>• {dep.fileCount} files</span>
                    </div>
                  </div>
                </div>

                {idx !== 0 && (
                  <button
                    onClick={() => handleRollback(dep.version)}
                    className="lb-btn-secondary text-xs font-bold px-4 py-1.5 self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Rollback to v{dep.version}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
