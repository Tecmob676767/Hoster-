import React, { useState } from 'react';
import { Upload, Check, Sparkles, ExternalLink, Terminal, Play } from 'lucide-react';
import { store } from '../services/store';

interface Props {
  onSuccessDeploy?: (siteUrl: string) => void;
  onOpenAuth?: () => void;
}

export default function DeployStation({ onSuccessDeploy, onOpenAuth }: Props) {
  const [deploying, setDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<'react' | 'portfolio' | 'ai' | 'blank'>('portfolio');
  const [progress, setProgress] = useState(0);

  const templates = [
    {
      id: 'portfolio' as const,
      name: 'Developer Portfolio',
      files: 'index.html, style.css, avatar.png',
      badge: 'Popular',
      color: '#4DA6FF',
    },
    {
      id: 'ai' as const,
      name: 'AI Agent Generated App',
      files: 'index.html, app.js, tailwind.css',
      badge: 'AI Ready',
      color: '#FF6DE4',
    },
    {
      id: 'react' as const,
      name: 'Modern React SPA',
      files: 'index.html, app.jsx, main.css',
      badge: 'Vite SPA',
      color: '#2AB09C',
    },
    {
      id: 'blank' as const,
      name: 'Clean Static Site',
      files: 'index.html, style.css',
      badge: 'Simple',
      color: '#FFE100',
    },
  ];

  const handleSimulateDeploy = () => {
    setDeploying(true);
    setProgress(15);
    setDeployedUrl(null);

    const timer1 = setTimeout(() => setProgress(45), 400);
    const timer2 = setTimeout(() => setProgress(80), 900);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setDeploying(false);
      const randomSub = `demo-${selectedTemplate}-${Math.floor(100 + Math.random() * 900)}`;
      const url = `https://${randomSub}.hosterplus.live`;
      setDeployedUrl(url);

      // Create in local store for seamless dashboard experience
      store.createProject(`Sample ${selectedTemplate.toUpperCase()} Site`, selectedTemplate);

      if (onSuccessDeploy) onSuccessDeploy(url);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleSimulateDeploy();
  };

  return (
    <div className="relative w-full rounded-3xl border-2 border-[#121316] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
      {/* Station Machine Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#E2E2DC] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFE100] border-2 border-[#121316] flex items-center justify-center font-bold shadow-[0_2px_0_#121316]">
            ⚡
          </div>
          <div>
            <h3 className="text-base font-black text-[#121316] leading-none">
              Live Instant Deploy Station
            </h3>
            <p className="text-xs text-[#666970] mt-0.5">
              Test instant deployment directly in your browser with zero setup
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-[#2AB09C]/15 text-[#2AB09C] px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2AB09C] pulse-dot" />
          Ready • Edge Online
        </span>
      </div>

      {/* Preset Selector */}
      <div className="mb-6">
        <p className="text-xs font-bold text-[#666970] uppercase tracking-wider mb-2.5">
          Select Starter Preset or Drop Files:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                selectedTemplate === t.id
                  ? 'border-[#121316] bg-[#FAFAF7] shadow-[0_3px_0_#121316] -translate-y-0.5'
                  : 'border-[#E2E2DC] hover:border-[#121316] bg-[#FFFFFF]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="w-3 h-3 rounded-full border border-[#121316]"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-[10px] font-bold text-[#666970] bg-[#F4F4F0] px-1.5 py-0.5 rounded-md">
                  {t.badge}
                </span>
              </div>
              <div className="text-xs font-bold text-[#121316] truncate">{t.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Dropzone & Deploy Box */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all ${
          deploying
            ? 'border-[#F12850] bg-[#F12850]/5'
            : deployedUrl
            ? 'border-[#2AB09C] bg-[#2AB09C]/5'
            : 'border-[#121316]/30 hover:border-[#121316] bg-[#F4F4F0]/60'
        }`}
      >
        {deploying ? (
          <div className="space-y-4 py-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#F12850] border-t-transparent animate-spin mx-auto" />
            <div>
              <p className="text-sm font-black text-[#121316]">
                Deploying to Global Edge Nodes... {progress}%
              </p>
              <p className="text-xs text-[#666970] mt-1 font-mono">
                Compiling assets → Auto-SSL Provisioning → CDN Broadcast
              </p>
            </div>
            <div className="w-48 sm:w-64 h-2 bg-[#E2E2DC] rounded-full overflow-hidden mx-auto">
              <div
                className="h-full bg-[#F12850] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : deployedUrl ? (
          <div className="space-y-4 py-2 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#2AB09C] text-white flex items-center justify-center mx-auto shadow-[0_3px_0_#1e7e70]">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#2AB09C] tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Deployed Live in 1.4s!
              </div>
              <h4 className="text-base font-bold text-[#121316]">Your project is live with HTTPS</h4>
              <a
                href={deployedUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-mono font-bold text-[#F12850] hover:underline"
              >
                {deployedUrl} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSimulateDeploy}
                className="lb-btn-secondary text-xs px-4 py-2"
              >
                Deploy Again
              </button>
              <button
                onClick={onOpenAuth}
                className="lb-btn-primary text-xs px-4 py-2"
              >
                Open in Full Studio Dashboard →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFFFFF] border-2 border-[#121316] text-[#121316] flex items-center justify-center mx-auto shadow-[0_3px_0_#121316]">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-[#121316]">
                Drop project files here or deploy the selected preset
              </p>
              <p className="text-xs text-[#666970] mt-1 font-medium">
                Supports static HTML/CSS/JS, Vite builds, images, and AI agent outputs
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSimulateDeploy}
                className="lb-btn-coral text-sm px-6 py-2.5 font-bold shadow-[0_3px_0_#b31634]"
              >
                <Play className="w-4 h-4 fill-white" />
                Deploy Preset in 1.8s
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Terminal / AI Token Quick Preview */}
      <div className="mt-5 p-4 rounded-2xl bg-[#121316] text-white flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 truncate">
          <Terminal className="w-4 h-4 text-[#FFE100] shrink-0" />
          <span className="text-[#888] hidden sm:inline">$</span>
          <span className="text-[#FAFAF7] truncate">
            curl -X POST https://hosterplus.app/api/upload -H "Authorization: Bearer token_..."
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#FFE100] shrink-0 ml-2 hidden sm:inline">
          AI Headless Ready
        </span>
      </div>
    </div>
  );
}
