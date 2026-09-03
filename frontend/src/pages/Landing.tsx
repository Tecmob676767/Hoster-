import { useState } from 'react';
import { 
  ArrowUpRight, 
  Layers, ChevronDown, ChevronUp, Sparkles,
  Upload, Bot, Shield, Globe, Zap
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WorldConnectionMap from '../components/WorldConnectionMap';
import DeployStation from '../components/DeployStation';
import AuthModal from '../components/AuthModal';
import type { User } from '../services/store';

interface Props {
  user: User | null;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
}

export default function Landing({ user, onLoginSuccess, onLogout }: Props) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What is Hoster++?",
      a: "Hoster++ is an ultra-fast, zero-friction web hosting platform designed for modern developers and AI coding agents. Drop your project files in your browser or generate an AI token for autonomous deployment with clean custom domains and instant auto-SSL."
    },
    {
      q: "Is Hoster++ truly 100% free with no subscriptions or paywalls?",
      a: "Yes! There are no pro subscription tiers, no hidden credit card requirements, and zero locked features. You get unlimited projects, clean custom domains, automated Let's Encrypt SSL, and unlimited AI deployment tokens completely free."
    },
    {
      q: "How does AI Token Deploy work?",
      a: "You generate a secure deployment token in your project dashboard and pass it to your AI agent (Claude Code, Cursor, ChatGPT, Gemini, or custom scripts). The AI sends a single cURL POST request with the built files, and your website is deployed live in under 2 seconds."
    },
    {
      q: "Can I use my own custom domain?",
      a: "Yes. Unlike platforms that force you into awkward subdomains, Hoster++ lets you point any root domain (e.g. myapp.com) or custom subdomain with simple A and CNAME DNS records. Let's Encrypt SSL certificates are provisioned and renewed automatically."
    },
    {
      q: "What kind of web projects can I host?",
      a: "You can host any static website, Single Page Application (React, Vite, Next.js static export, Vue, Svelte, Astro), documentation site, HTML5 game, portfolio, or AI-generated web tool."
    },
    {
      q: "Are my deployments private and secure?",
      a: "Yes. Files are compiled and distributed directly to global CDN edge nodes over TLS 1.3 encryption. AI tokens can be given expiration dates and revoked instantly with a single click at any time."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#121316] selection:bg-[#F12850] selection:text-white">
      {/* Header */}
      <Header 
        user={user} 
        onOpenAuth={() => setAuthModalOpen(true)} 
        onLogout={onLogout} 
      />

      {/* Hero Section (LensBooth style) */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border-2 border-[#121316] px-3.5 py-1.5 rounded-full shadow-[0_2px_0_#121316]">
              <span className="w-2 h-2 rounded-full bg-[#F12850] pulse-dot" />
              <span className="text-xs font-black uppercase tracking-wider text-[#121316]">
                Instant Web Deployment Station
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#121316] leading-[1.08]">
              The instant<br />
              hosting platform for<br />
              <span className="accent">modern web</span>.
            </h1>

            <p className="text-base sm:text-lg text-[#666970] font-medium leading-relaxed max-w-xl">
              The free online hosting platform for developers, creators, and AI agents.
              Deploy <strong className="text-[#121316]">clean custom domains</strong>, instant auto-SSL,
              and drag-and-drop builds with zero subscriptions or friction.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="lb-btn-coral text-base font-bold px-7 py-3.5 shadow-[0_4px_0_#b31634]"
              >
                <Sparkles className="w-5 h-5 fill-white" />
                <span>Enter Studio Free</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href="#how"
                className="lb-btn-secondary text-base font-bold px-7 py-3.5"
              >
                How It Works
              </a>
            </div>

            {/* Quick feature checklist */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-bold text-[#666970]">
              <span className="flex items-center gap-1.5">
                <span className="text-[#2AB09C] text-sm">✓</span> No App or CLI Needed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#2AB09C] text-sm">✓</span> 100% Free & Unlimited
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[#2AB09C] text-sm">✓</span> AI Autonomous Deploy
              </span>
            </div>
          </div>

          {/* Hero Right Column: Deploy Station Visual */}
          <div className="lg:col-span-6 space-y-6">
            <DeployStation onOpenAuth={() => setAuthModalOpen(true)} />
          </div>
        </div>
      </section>

      {/* Marquee Trust Badges (LensBooth Infinite Marquee) */}
      <section className="py-6 border-y-2 border-[#121316] bg-[#FFFFFF] overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-track">
            {[
              { icon: '⚡', text: '< 2s Global Edge Deploy' },
              { icon: '🌐', text: 'Clean Custom Domains' },
              { icon: '🤖', text: 'AI Agent Deploy Tokens' },
              { icon: '🔒', text: 'Free Auto-SSL / Let’s Encrypt' },
              { icon: '📦', text: 'Drag & Drop Folder Deploy' },
              { icon: '🔄', text: '1-Click Version Rollbacks' },
              { icon: '✨', text: '100% Free Forever' },
            ].map((b, i) => (
              <div
                key={i}
                className="stat-pill border-2 border-[#121316] bg-[#FAFAF7] font-bold text-xs whitespace-nowrap text-[#121316] shadow-[0_2px_0_#121316]"
              >
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
          <div className="marquee-track" aria-hidden="true">
            {[
              { icon: '⚡', text: '< 2s Global Edge Deploy' },
              { icon: '🌐', text: 'Clean Custom Domains' },
              { icon: '🤖', text: 'AI Agent Deploy Tokens' },
              { icon: '🔒', text: 'Free Auto-SSL / Let’s Encrypt' },
              { icon: '📦', text: 'Drag & Drop Folder Deploy' },
              { icon: '🔄', text: '1-Click Version Rollbacks' },
              { icon: '✨', text: '100% Free Forever' },
            ].map((b, i) => (
              <div
                key={`clone-${i}`}
                className="stat-pill border-2 border-[#121316] bg-[#FAFAF7] font-bold text-xs whitespace-nowrap text-[#121316] shadow-[0_2px_0_#121316]"
              >
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Platform Activity Stats (LensBooth Stats Row) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-black text-[#121316]">
            Live platform <span className="accent">activity</span>
          </h2>
          <p className="text-sm font-medium text-[#666970] mt-1.5">
            Join thousands of developers and AI agents deploying websites right now.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lb-card border-2 border-[#121316] text-center p-6 shadow-[0_4px_0_#121316]">
            <div className="text-3xl sm:text-4xl font-black text-[#121316]">128,490+</div>
            <div className="text-xs font-bold text-[#666970] uppercase tracking-wider mt-1">
              Deploys Live
            </div>
          </div>

          <div className="lb-card border-2 border-[#121316] text-center p-6 shadow-[0_4px_0_#121316]">
            <div className="text-3xl sm:text-4xl font-black text-[#121316]">42,300+</div>
            <div className="text-xs font-bold text-[#666970] uppercase tracking-wider mt-1">
              Active Developers
            </div>
          </div>

          <div className="lb-card border-2 border-[#121316] text-center p-6 shadow-[0_4px_0_#121316]">
            <div className="text-3xl sm:text-4xl font-black text-[#121316]">64,200+</div>
            <div className="text-xs font-bold text-[#666970] uppercase tracking-wider mt-1">
              Custom Domains
            </div>
          </div>

          <div className="lb-card border-2 border-[#121316] text-center p-6 shadow-[0_4px_0_#121316] bg-[#2AB09C]/10 border-[#2AB09C]">
            <div className="text-3xl sm:text-4xl font-black text-[#2AB09C] flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2AB09C] pulse-dot" />
              4,120
            </div>
            <div className="text-xs font-bold text-[#2AB09C] uppercase tracking-wider mt-1">
              Active Now
            </div>
          </div>
        </div>
      </section>

      {/* Global Edge Network Map */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <WorldConnectionMap />
      </section>

      {/* "Meet Hoster++" Product Cards (LensBooth 3/4 Card Grid) */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#121316]">
            Meet <span className="accent">Hoster++</span>
          </h2>
          <p className="text-base text-[#666970] font-medium mt-2">
            Engineered from the ground up for maximum speed, zero setup friction, and full AI agent compatibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="lb-card border-2 border-[#121316] shadow-[0_4px_0_#121316] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#4DA6FF] text-white flex items-center justify-center mb-5 shadow-[0_3px_0_#2b82d4]">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#121316] mb-2">
                Instant in your browser
              </h3>
              <p className="text-sm text-[#666970] leading-relaxed font-medium">
                No complex build tools, no CLI configurations, and no server maintenance.
                Simply drag and drop your project files and your site is live in under 2 seconds.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E2E2DC] text-xs font-bold text-[#4DA6FF] flex items-center gap-1">
              <span>Supports all static formats</span> →
            </div>
          </div>

          {/* Card 2 */}
          <div className="lb-card border-2 border-[#121316] shadow-[0_4px_0_#121316] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6DE4] text-white flex items-center justify-center mb-5 shadow-[0_3px_0_#c93bb0]">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#121316] mb-2">
                Built for AI Agents
              </h3>
              <p className="text-sm text-[#666970] leading-relaxed font-medium">
                Generate an AI deploy token and hand it to Claude Code, Cursor, or ChatGPT.
                The AI uploads and publishes your web application automatically without human intervention.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E2E2DC] text-xs font-bold text-[#FF6DE4] flex items-center gap-1">
              <span>Autonomous CI/CD token API</span> →
            </div>
          </div>

          {/* Card 3 */}
          <div className="lb-card border-2 border-[#121316] shadow-[0_4px_0_#121316] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#2AB09C] text-white flex items-center justify-center mb-5 shadow-[0_3px_0_#1b7e6f]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#121316] mb-2">
                Clean Domains & Auto SSL
              </h3>
              <p className="text-sm text-[#666970] leading-relaxed font-medium">
                Bring any custom domain without awkward forced subdomains or provider ads.
                Let's Encrypt TLS certificates are automatically provisioned and renewed forever.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E2E2DC] text-xs font-bold text-[#2AB09C] flex items-center gap-1">
              <span>Zero-cost HTTPS included</span> →
            </div>
          </div>
        </div>
      </section>

      {/* "Two Ways to Deploy" Section (LensBooth Two Ways Style) */}
      <section id="modes" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#FFFFFF] rounded-3xl border-2 border-[#121316] shadow-[0_12px_36px_rgba(0,0,0,0.06)] my-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#121316]">
            Two ways to <span className="accent">deploy</span> sites
          </h2>
          <p className="text-base text-[#666970] font-medium mt-2">
            Whether you want visual studio control in your browser or headless deployment via AI agents, Hoster++ has you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mode 1: Studio Drag & Drop */}
          <div className="p-8 rounded-3xl border-2 border-[#121316] bg-[#FAFAF7] flex flex-col justify-between shadow-[0_4px_0_#121316]">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FFE100] text-[#121316] text-xs font-extrabold px-3 py-1 rounded-full border border-[#121316] mb-4">
                MODE 01 • VISUAL DASHBOARD
              </div>
              <h3 className="text-2xl font-black text-[#121316] mb-3">
                Studio Drag & Drop
              </h3>
              <p className="text-sm text-[#666970] leading-relaxed font-medium mb-6">
                Open the visual web studio on any laptop, tablet, or phone. Drop HTML, CSS, JS, and asset folders to deploy instantly.
              </p>

              <ul className="space-y-3 text-xs font-bold text-[#121316]">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#4DA6FF] text-white flex items-center justify-center text-[10px]">✓</span>
                  Interactive file tree and in-app responsive live preview
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#4DA6FF] text-white flex items-center justify-center text-[10px]">✓</span>
                  Custom domain DNS validator and live propagation inspector
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#4DA6FF] text-white flex items-center justify-center text-[10px]">✓</span>
                  1-Click version rollbacks to any prior deployment
                </li>
              </ul>
            </div>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="mt-8 lb-btn-primary w-full text-sm font-bold py-3.5"
            >
              <span>Launch Visual Studio</span> →
            </button>
          </div>

          {/* Mode 2: AI Agent Headless */}
          <div className="p-8 rounded-3xl border-2 border-[#121316] bg-[#FAFAF7] flex flex-col justify-between shadow-[0_4px_0_#121316]">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FF6DE4] text-white text-xs font-extrabold px-3 py-1 rounded-full border border-[#121316] mb-4">
                MODE 02 • AI HEADLESS
              </div>
              <h3 className="text-2xl font-black text-[#121316] mb-3">
                AI Agent Upload Tokens
              </h3>
              <p className="text-sm text-[#666970] leading-relaxed font-medium mb-6">
                Generate an authorization token and provide it to any LLM or CI/CD script. The agent deploys builds directly via HTTP.
              </p>

              <ul className="space-y-3 text-xs font-bold text-[#121316]">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF6DE4] text-white flex items-center justify-center text-[10px]">✓</span>
                  One-click cURL, Node.js & Python command generation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF6DE4] text-white flex items-center justify-center text-[10px]">✓</span>
                  Custom token lifetimes (1h, 24h, 7d, 30d, or never)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF6DE4] text-white flex items-center justify-center text-[10px]">✓</span>
                  Instant revocation & real-time token audit logs
                </li>
              </ul>
            </div>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="mt-8 lb-btn-coral w-full text-sm font-bold py-3.5"
            >
              <span>Generate AI Deploy Token</span> →
            </button>
          </div>
        </div>
      </section>

      {/* "How It Works" 4 Simple Steps (LensBooth 4-Step Sequence) */}
      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-[#121316]">
            How it <span className="accent">works</span>
          </h2>
          <p className="text-base text-[#666970] font-medium mt-2">
            Four simple steps from opening your browser to live worldwide hosting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              title: 'Create Your Project',
              desc: 'Pick a blank project or start from one of our quick presets (React, Portfolio, AI App).',
              color: '#4DA6FF',
              icon: <Layers className="w-5 h-5" />
            },
            {
              step: '2',
              title: 'Drop Files or Use AI',
              desc: 'Drag your build folder into the studio or hand an AI token to your autonomous coding agent.',
              color: '#FF6DE4',
              icon: <Upload className="w-5 h-5" />
            },
            {
              step: '3',
              title: 'Edge CDN Sync',
              desc: 'Assets are compressed, hashed, and propagated to 320+ edge servers in under 1.8 seconds.',
              color: '#FFE100',
              icon: <Zap className="w-5 h-5 text-[#121316]" />
            },
            {
              step: '4',
              title: 'Live Custom Domain',
              desc: 'Access your site instantly on your clean custom domain with automated Let’s Encrypt HTTPS.',
              color: '#2AB09C',
              icon: <Globe className="w-5 h-5" />
            }
          ].map((s, idx) => (
            <div key={idx} className="lb-card border-2 border-[#121316] shadow-[0_4px_0_#121316]">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white mb-4 shadow-[0_2px_0_rgba(0,0,0,0.2)]"
                style={{ backgroundColor: s.color }}
              >
                {s.icon}
              </div>
              <div className="text-xs font-black uppercase text-[#666970] tracking-wider mb-1">
                Step 0{s.step}
              </div>
              <h3 className="text-base font-black text-[#121316] mb-2">{s.title}</h3>
              <p className="text-xs text-[#666970] leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 100% Free Guarantee Banner (No Pro Subscription!) */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border-2 border-[#121316] bg-[#FFFFFF] p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 bg-[#FFE100] text-[#121316] text-xs font-black uppercase px-4 py-1.5 rounded-full border border-[#121316] mb-4">
            Zero Subscriptions • 100% Free Forever
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#121316] tracking-tight mb-4">
            Everything Unlimited. <span className="accent">Zero Cost.</span>
          </h2>

          <p className="text-base text-[#666970] max-w-2xl mx-auto font-medium mb-8">
            We believe fast web hosting and AI agent deployments should be accessible to all developers without monthly subscriptions, paywalls, or credit cards.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8 text-left">
            <div className="p-4 rounded-2xl bg-[#F4F4F0] border border-[#E2E2DC]">
              <div className="text-xs font-bold text-[#666970]">Projects</div>
              <div className="text-lg font-black text-[#121316]">Unlimited</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F4F0] border border-[#E2E2DC]">
              <div className="text-xs font-bold text-[#666970]">Custom Domains</div>
              <div className="text-lg font-black text-[#121316]">Unlimited</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F4F0] border border-[#E2E2DC]">
              <div className="text-xs font-bold text-[#666970]">SSL / HTTPS</div>
              <div className="text-lg font-black text-[#121316]">100% Free</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F4F0] border border-[#E2E2DC]">
              <div className="text-xs font-bold text-[#666970]">AI Tokens</div>
              <div className="text-lg font-black text-[#121316]">Unlimited</div>
            </div>
          </div>

          <button
            onClick={() => setAuthModalOpen(true)}
            className="lb-btn-coral text-base font-bold px-8 py-3.5 shadow-[0_4px_0_#b31634]"
          >
            Start Hosting Now — 100% Free
          </button>
        </div>
      </section>

      {/* FAQ Accordion Section (LensBooth FAQ style) */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-[#121316]">
            Frequently Asked <span className="accent">Questions</span>
          </h2>
          <p className="text-sm font-medium text-[#666970] mt-1.5">
            Everything you need to know about Hoster++, custom domains, and AI deployments.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="lb-card border-2 border-[#121316] p-5 shadow-[0_3px_0_#121316] transition-all"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full flex items-center justify-between text-left font-black text-base text-[#121316] gap-4"
              >
                <span>{f.q}</span>
                <span className="w-8 h-8 rounded-full bg-[#F4F4F0] border border-[#E2E2DC] flex items-center justify-center shrink-0">
                  {openFaq === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>
              {openFaq === i && (
                <div className="mt-3 pt-3 border-t border-[#E2E2DC] text-sm text-[#666970] font-medium leading-relaxed animate-in fade-in">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Final CTA (LensBooth CTA) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-3xl bg-[#F12850] text-white flex items-center justify-center mx-auto shadow-[0_4px_0_#b31634]">
            <Zap className="w-7 h-7 fill-white" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#121316] tracking-tight">
            Ready to host <span className="accent">smarter</span>?
          </h2>
          <p className="text-base text-[#666970] font-medium">
            Join thousands of developers using Hoster++ to deploy websites and AI apps in seconds.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="lb-btn-coral text-base font-bold px-9 py-4 shadow-[0_4px_0_#b31634]"
          >
            Enter Studio Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={u => onLoginSuccess(u)}
      />
    </div>
  );
}
