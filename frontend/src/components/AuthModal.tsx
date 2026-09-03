import React, { useState } from 'react';
import { X, Zap, ArrowRight, User as UserIcon } from 'lucide-react';
import { store, DEMO_PERSONAS, type User } from '../services/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: Props) {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'google' | 'persona' | 'custom'>('google');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInstantGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      // 1-click Google OAuth simulator with high fidelity
      const user = store.loginWithPersona(DEMO_PERSONAS[0]);
      setLoading(false);
      onSuccess(user);
      onClose();
    }, 450);
  };

  const handlePersonaSelect = (p: User) => {
    setLoading(true);
    setTimeout(() => {
      const user = store.loginWithPersona(p);
      setLoading(false);
      onSuccess(user);
      onClose();
    }, 300);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const customUser: User = {
        id: `usr_${Date.now().toString(36)}`,
        name: customName.trim(),
        email: customEmail.trim() || `${customName.toLowerCase().replace(/\s+/g, '')}@dev.io`,
        plan: 'Free Unlimited',
      };
      store.setUser(customUser);
      setLoading(false);
      onSuccess(customUser);
      onClose();
    }, 350);
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const guest = store.loginAsGuest();
      setLoading(false);
      onSuccess(guest);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#FFFFFF] rounded-3xl border-2 border-[#121316] p-7 shadow-[0_16px_48px_rgba(0,0,0,0.18)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative corner tag */}
        <div className="absolute top-0 right-0 bg-[#FFE100] text-[#121316] text-[11px] font-bold px-3 py-1 rounded-bl-xl border-l-2 border-b-2 border-[#121316] uppercase tracking-wider">
          100% Free Forever
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#E2E2DC] flex items-center justify-center text-[#121316] hover:bg-[#F4F4F0] hover:border-[#121316] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#F12850] text-white flex items-center justify-center mb-3 shadow-[0_3px_0_#b31634]">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#121316] tracking-tight">
            Sign in to <span className="accent">Hoster++</span>
          </h2>
          <p className="text-sm text-[#666970] mt-1 font-medium">
            Deploy your websites with clean custom domains & AI tokens. No credit card required.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-[#F4F4F0] rounded-xl mb-5 border border-[#E2E2DC]">
          <button
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'google' ? 'bg-[#FFFFFF] text-[#121316] shadow-sm' : 'text-[#666970] hover:text-[#121316]'
            }`}
          >
            Google One-Click
          </button>
          <button
            onClick={() => setActiveTab('persona')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'persona' ? 'bg-[#FFFFFF] text-[#121316] shadow-sm' : 'text-[#666970] hover:text-[#121316]'
            }`}
          >
            Demo Accounts
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'custom' ? 'bg-[#FFFFFF] text-[#121316] shadow-sm' : 'text-[#666970] hover:text-[#121316]'
            }`}
          >
            Custom Name
          </button>
        </div>

        {/* Tab Content: Google */}
        {activeTab === 'google' && (
          <div className="space-y-4">
            <button
              onClick={handleInstantGoogle}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#121316] text-[#121316] font-bold text-sm hover:bg-[#F4F4F0] flex items-center justify-center gap-3 transition-all shadow-[0_3px_0_#121316] active:translate-y-0.5 active:shadow-[0_1px_0_#121316] disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? 'Authenticating...' : 'Continue with Google'}
            </button>

            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-[#F4F4F0] border border-[#E2E2DC] text-[#121316] font-semibold text-xs hover:bg-[#EAEAE5] flex items-center justify-center gap-2 transition-all"
            >
              <UserIcon className="w-3.5 h-3.5" />
              Continue as Guest (Instant Access)
            </button>
          </div>
        )}

        {/* Tab Content: Demo Personas */}
        {activeTab === 'persona' && (
          <div className="space-y-2.5">
            <p className="text-xs text-[#666970] mb-2 font-medium">Select a demo developer account:</p>
            {DEMO_PERSONAS.map(p => (
              <button
                key={p.id}
                onClick={() => handlePersonaSelect(p)}
                disabled={loading}
                className="w-full p-3 rounded-2xl border border-[#E2E2DC] hover:border-[#121316] bg-[#FFFFFF] hover:bg-[#FAFAF7] flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover border border-[#E2E2DC]" />
                  <div>
                    <div className="text-xs font-bold text-[#121316]">{p.name}</div>
                    <div className="text-[11px] text-[#666970]">{p.email}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#666970] group-hover:text-[#121316] group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        )}

        {/* Tab Content: Custom Name */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#121316] mb-1">Your Name</label>
              <input
                type="text"
                required
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="e.g. Satoshi Nakamoto"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F4F4F0] border border-[#E2E2DC] text-sm text-[#121316] placeholder-[#888] focus:outline-none focus:border-[#121316] focus:bg-[#FFFFFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#121316] mb-1">Email (Optional)</label>
              <input
                type="email"
                value={customEmail}
                onChange={e => setCustomEmail(e.target.value)}
                placeholder="e.g. dev@build.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F4F4F0] border border-[#E2E2DC] text-sm text-[#121316] placeholder-[#888] focus:outline-none focus:border-[#121316] focus:bg-[#FFFFFF]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !customName.trim()}
              className="w-full mt-2 py-3 rounded-2xl bg-[#121316] text-white font-bold text-sm hover:bg-[#1f2229] transition-all shadow-[0_3px_0_rgba(0,0,0,0.3)] disabled:opacity-50"
            >
              {loading ? 'Creating session...' : 'Enter Studio'}
            </button>
          </form>
        )}

        {/* Features bullet list */}
        <div className="mt-6 pt-5 border-t border-[#E2E2DC] grid grid-cols-2 gap-2 text-[11px] text-[#666970] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-[#2AB09C] font-bold">✓</span> Free Custom Domains
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#2AB09C] font-bold">✓</span> Auto Let's Encrypt SSL
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#2AB09C] font-bold">✓</span> Unlimited AI Tokens
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#2AB09C] font-bold">✓</span> Instant CDN Deploys
          </div>
        </div>
      </div>
    </div>
  );
}
