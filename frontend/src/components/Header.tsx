import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Menu, X, ArrowUpRight, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import type { User } from '../services/store';

interface Props {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Header({ user, onOpenAuth, onLogout }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <>
      {/* Top Announcement Bar (LensBooth style) */}
      <div className="bg-[#121316] text-white text-[12px] py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#2AB09C] pulse-dot" />
        <span>Hoster++ 2.0 is 100% Free & Open — Unlimited Custom Domains, Auto SSL & AI Tokens</span>
        <a href="#how" className="underline underline-offset-2 text-[#FFE100] font-bold hover:text-white transition-colors ml-1">
          Learn how it works →
        </a>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#F4F4F0]/90 backdrop-blur-md border-b border-[#E2E2DC] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#F12850] text-white flex items-center justify-center shadow-[0_3px_0_#b31634] group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-[#121316] tracking-tight flex items-center gap-1.5">
                  Hoster<span className="text-[#F12850]">++</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#666970] -mt-1">
                  Instant Web Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#666970]">
              <a href="#how" className="hover:text-[#121316] transition-colors">How it works</a>
              <a href="#features" className="hover:text-[#121316] transition-colors">Features</a>
              <a href="#modes" className="hover:text-[#121316] transition-colors">Deploy Modes</a>
              <a href="#ai-tokens" className="hover:text-[#121316] transition-colors">AI Tokens</a>
              <a href="#showcase" className="hover:text-[#121316] transition-colors">Showcase</a>
              <a href="#faq" className="hover:text-[#121316] transition-colors">FAQ</a>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-[#E2E2DC] bg-[#FFFFFF] hover:border-[#121316] transition-all"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#121316] text-white flex items-center justify-center text-xs font-bold">
                        {user.name[0]}
                      </div>
                    )}
                    <span className="text-xs font-bold text-[#121316] hidden sm:block">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {userDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] rounded-2xl border-2 border-[#121316] p-2 shadow-xl z-50 animate-in fade-in">
                      <div className="p-3 border-b border-[#E2E2DC] mb-1">
                        <p className="text-xs font-bold text-[#121316] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#666970] truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-extrabold bg-[#2AB09C]/15 text-[#2AB09C] px-2 py-0.5 rounded-full">
                          {user.plan}
                        </span>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 w-full p-2 rounded-xl text-xs font-bold text-[#121316] hover:bg-[#F4F4F0] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          onLogout();
                        }}
                        className="flex items-center gap-2 w-full p-2 rounded-xl text-xs font-bold text-[#F12850] hover:bg-[#F12850]/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="lb-btn-secondary text-xs font-bold px-4 py-2 hidden sm:inline-flex"
                >
                  Sign In
                </button>
              )}

              {/* Primary CTA (Enter Studio) */}
              <Link
                to={user ? "/dashboard" : "#"}
                onClick={user ? undefined : onOpenAuth}
                className="lb-btn-coral text-xs sm:text-sm font-bold px-5 py-2.5"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>{user ? "Go to Studio" : "Enter Studio"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              {/* Mobile menu toggle button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl border border-[#E2E2DC] text-[#121316] hover:bg-[#FFFFFF]"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="absolute top-0 right-0 w-4/5 max-w-sm h-full bg-[#F4F4F0] p-6 shadow-2xl flex flex-col justify-between border-l-2 border-[#121316]">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#E2E2DC]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F12850] text-white flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="font-black text-lg text-[#121316]">Hoster++</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full border border-[#E2E2DC] text-[#121316]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <a
                  href="#how"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold text-[#121316] hover:text-[#F12850]"
                >
                  How it works
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold text-[#121316] hover:text-[#F12850]"
                >
                  Features
                </a>
                <a
                  href="#modes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold text-[#121316] hover:text-[#F12850]"
                >
                  Deploy Modes
                </a>
                <a
                  href="#ai-tokens"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold text-[#121316] hover:text-[#F12850]"
                >
                  AI Tokens
                </a>
                <a
                  href="#showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold text-[#121316] hover:text-[#F12850]"
                >
                  Showcase
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold text-[#121316] hover:text-[#F12850]"
                >
                  FAQ
                </a>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#E2E2DC]">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="lb-btn-primary w-full text-center"
                  >
                    Open Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2.5 text-xs font-bold text-[#F12850] text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="lb-btn-coral w-full"
                  >
                    Sign in with Google
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
