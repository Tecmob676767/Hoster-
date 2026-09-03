export default function WorldConnectionMap() {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border-2 border-[#121316] bg-[#FFFFFF] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E2DC] mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2AB09C] pulse-dot" />
          <span className="text-xs font-black uppercase tracking-wider text-[#121316]">
            Global Edge CDN Mesh
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#666970]">
          <span className="hidden sm:inline">⚡ Avg Latency: <strong className="text-[#121316]">18ms</strong></span>
          <span className="bg-[#2AB09C]/10 text-[#2AB09C] font-bold px-2 py-0.5 rounded-full">
            320+ Edge PoPs
          </span>
        </div>
      </div>

      {/* SVG Canvas with Curved Connection Paths */}
      <div className="relative h-64 sm:h-80 w-full flex items-center justify-center">
        {/* Stylized World Grid Background */}
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

        <svg
          viewBox="0 0 1000 400"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="edgeGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4DA6FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#F12850" stopOpacity="1" />
              <stop offset="100%" stopColor="#2AB09C" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="edgeGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FF6DE4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFE100" stopOpacity="1" />
              <stop offset="100%" stopColor="#F12850" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Connection Bezier Curves */}
          <path
            d="M 180 140 C 350 140, 350 200, 500 200"
            fill="none"
            stroke="url(#edgeGradLeft)"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
          <path
            d="M 820 160 C 650 160, 650 200, 500 200"
            fill="none"
            stroke="url(#edgeGradRight)"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
          <path
            d="M 220 300 C 380 300, 380 200, 500 200"
            fill="none"
            stroke="#4DA6FF"
            strokeWidth="2"
            strokeOpacity="0.5"
          />
          <path
            d="M 780 280 C 620 280, 620 200, 500 200"
            fill="none"
            stroke="#2AB09C"
            strokeWidth="2"
            strokeOpacity="0.5"
          />

          {/* Central Hub Core */}
          <circle cx="500" cy="200" r="32" fill="#121316" />
          <circle cx="500" cy="200" r="22" fill="#F12850" />
          <circle cx="500" cy="200" r="10" fill="#FFFFFF" />

          {/* Animated Particles */}
          <circle cx="340" cy="170" r="5" fill="#F12850" className="pulse-dot" />
          <circle cx="660" cy="180" r="5" fill="#4DA6FF" className="pulse-dot" />
        </svg>

        {/* Node Location Pins matching LensBooth */}
        {/* Node 1: San Francisco */}
        <div className="absolute top-6 left-4 sm:left-12 flex items-center gap-2 bg-[#FFFFFF] border-2 border-[#121316] p-2 rounded-2xl shadow-[0_3px_0_#121316]">
          <div className="w-7 h-7 rounded-xl bg-[#4DA6FF] text-white flex items-center justify-center font-bold text-xs">
            US
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-[#121316] leading-none">San Francisco</div>
            <div className="text-[9px] font-mono text-[#2AB09C] font-bold">12ms • Origin</div>
          </div>
        </div>

        {/* Node 2: Frankfurt */}
        <div className="absolute top-8 right-4 sm:right-16 flex items-center gap-2 bg-[#FFFFFF] border-2 border-[#121316] p-2 rounded-2xl shadow-[0_3px_0_#121316]">
          <div className="w-7 h-7 rounded-xl bg-[#FF6DE4] text-white flex items-center justify-center font-bold text-xs">
            EU
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-[#121316] leading-none">Frankfurt</div>
            <div className="text-[9px] font-mono text-[#2AB09C] font-bold">18ms • Edge</div>
          </div>
        </div>

        {/* Center Badge: Instant Auto-SSL & DNS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#121316] text-white py-1.5 px-4 rounded-full shadow-lg text-xs font-bold whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#FFE100] pulse-dot" />
          <span>Zero Cold Starts • Any Custom Domain</span>
        </div>

        {/* Node 3: Tokyo */}
        <div className="hidden sm:flex absolute bottom-8 right-12 items-center gap-2 bg-[#FFFFFF] border-2 border-[#121316] p-2 rounded-2xl shadow-[0_3px_0_#121316]">
          <div className="w-7 h-7 rounded-xl bg-[#FFE100] text-[#121316] flex items-center justify-center font-bold text-xs">
            AP
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-[#121316] leading-none">Tokyo</div>
            <div className="text-[9px] font-mono text-[#2AB09C] font-bold">24ms • Edge</div>
          </div>
        </div>

        {/* Node 4: Singapore */}
        <div className="hidden sm:flex absolute bottom-8 left-16 items-center gap-2 bg-[#FFFFFF] border-2 border-[#121316] p-2 rounded-2xl shadow-[0_3px_0_#121316]">
          <div className="w-7 h-7 rounded-xl bg-[#2AB09C] text-white flex items-center justify-center font-bold text-xs">
            SG
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-[#121316] leading-none">Singapore</div>
            <div className="text-[9px] font-mono text-[#2AB09C] font-bold">29ms • Edge</div>
          </div>
        </div>
      </div>
    </div>
  );
}
