import { Zap, Heart, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FFFFFF] border-t-2 border-[#121316] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E2E2DC]">
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#F12850] text-white flex items-center justify-center shadow-[0_2px_0_#b31634]">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-black text-[#121316]">
                Hoster<span className="text-[#F12850]">++</span>
              </span>
            </Link>
            <p className="text-xs text-[#666970] leading-relaxed font-medium">
              The instant, free web hosting platform for developers, creators, and AI agents.
              Zero subscriptions, clean custom domains, and automated SSL.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#F4F4F0] border border-[#E2E2DC] px-3 py-1 rounded-full text-[11px] font-bold text-[#121316]">
              <span className="w-2 h-2 rounded-full bg-[#2AB09C] pulse-dot" />
              <span>All Edge PoPs Operational</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#121316]">
              Product
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#666970]">
              <li><a href="#how" className="hover:text-[#121316] transition-colors">How it works</a></li>
              <li><a href="#features" className="hover:text-[#121316] transition-colors">Features & Edge Mesh</a></li>
              <li><a href="#modes" className="hover:text-[#121316] transition-colors">Deploy Modes</a></li>
              <li><a href="#ai-tokens" className="hover:text-[#121316] transition-colors">AI Agent Tokens</a></li>
              <li><a href="#pricing" className="hover:text-[#121316] transition-colors">100% Free Guarantee</a></li>
            </ul>
          </div>

          {/* Col 3: Integrations */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#121316]">
              AI Integrations
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#666970]">
              <li><span className="hover:text-[#121316] cursor-pointer">Claude Code & Sonnet</span></li>
              <li><span className="hover:text-[#121316] cursor-pointer">Cursor AI Deploy Token</span></li>
              <li><span className="hover:text-[#121316] cursor-pointer">ChatGPT & GPT-4o Agent</span></li>
              <li><span className="hover:text-[#121316] cursor-pointer">Gemini CLI & OpenDevin</span></li>
              <li><span className="hover:text-[#121316] cursor-pointer">cURL & REST API</span></li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#121316]">
              Developers
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#666970]">
              <li><a href="#faq" className="hover:text-[#121316] transition-colors">Frequently Asked Questions</a></li>
              <li><span className="hover:text-[#121316] cursor-pointer">DNS Configuration Guide</span></li>
              <li><span className="hover:text-[#121316] cursor-pointer">Auto Let's Encrypt SSL</span></li>
              <li><span className="hover:text-[#121316] cursor-pointer">Privacy & Local Processing</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#666970]">
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-[#F12850] fill-[#F12850]" />
            <span>by the Hoster++ Team • Inspired by LensBooth Design System</span>
          </div>

          <div className="flex items-center gap-6">
            <span>v2.4.0 (Zero-Lockin)</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 p-2 rounded-full border border-[#E2E2DC] hover:border-[#121316] hover:bg-[#F4F4F0] text-[#121316] transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
