import { Zap, Globe, Upload, Bot, Lock, Gauge, GitBranch, ChevronRight, Check } from 'lucide-react'

export default function Landing() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google'
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="fixed inset-0 bg-gradient-radial from-violet-900/20 via-transparent to-transparent" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Hoster++</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-gray-400">More powerful than Vercel</span>
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          More Advanced Than Vercel
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight max-w-4xl mb-6 leading-none">
          Host anything.<br />
          <span className="gradient-text">Instantly.</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Hoster++ is the fastest way to host your sites with <strong className="text-white">clean custom domains</strong>,
          instant SSL, and a unique <strong className="text-violet-300">AI upload system</strong> — give an AI a token
          and it deploys your project automatically.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-violet-500/25 glow"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white" fillOpacity="0.9"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" fillOpacity="0.9"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white" fillOpacity="0.9"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" fillOpacity="0.9"/>
            </svg>
            Start Hosting Free
            <ChevronRight className="w-5 h-5" />
          </button>
          <a href="#features" className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-white font-semibold text-lg hover:bg-white/5 transition-all">
            See Features
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-center">
          {[
            { value: '< 5s', label: 'Deploy time' },
            { value: '∞', label: 'Custom domains' },
            { value: '100%', label: 'Free SSL' },
            { value: 'AI', label: 'Upload via token' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">
          Everything you need. <span className="gradient-text">Nothing you don't.</span>
        </h2>
        <p className="text-center text-gray-400 mb-14 max-w-xl mx-auto">
          Built for developers who want speed, power, and simplicity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <Globe className="w-6 h-6 text-violet-400" />,
              title: 'Clean Custom Domains',
              desc: 'Point any domain to your site. No forced subdomains, no extra names. Your domain, your brand.',
              color: 'violet',
            },
            {
              icon: <Bot className="w-6 h-6 text-cyan-400" />,
              title: 'AI Token Upload',
              desc: 'Generate a deploy token, give it to any AI agent. It uploads and deploys your project automatically.',
              color: 'cyan',
              badge: 'Unique',
            },
            {
              icon: <Upload className="w-6 h-6 text-emerald-400" />,
              title: 'Drag & Drop Deploy',
              desc: 'Drop your project files in the dashboard. Entire folders supported. Live in seconds.',
              color: 'emerald',
            },
            {
              icon: <Lock className="w-6 h-6 text-yellow-400" />,
              title: 'Auto SSL / HTTPS',
              desc: "Let's Encrypt SSL auto-provisioned for every domain. Always free, always renewed.",
              color: 'yellow',
            },
            {
              icon: <Gauge className="w-6 h-6 text-rose-400" />,
              title: 'Lightning Fast',
              desc: 'Nginx-powered serving with gzip, cache headers, and SPA fallback out of the box.',
              color: 'rose',
            },
            {
              icon: <GitBranch className="w-6 h-6 text-orange-400" />,
              title: 'Deployment History',
              desc: 'Every deploy is versioned. Roll back to any previous deployment with one click.',
              color: 'orange',
            },
          ].map(f => (
            <div key={f.title} className="card-hover relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {f.badge && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
                  {f.badge}
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl bg-${f.color}-500/10 border border-${f.color}-500/20 flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-14">Simple <span className="gradient-text">Pricing</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: 'Free',
              price: '\$0',
              per: 'forever',
              features: ['3 projects', 'Free subdomain', '500MB storage', 'AI token upload', 'SSL included'],
              cta: 'Get Started',
              highlight: false,
            },
            {
              name: 'Pro',
              price: '\$9',
              per: 'per month',
              features: ['Unlimited projects', 'Custom domains', '10GB storage', 'Unlimited AI tokens', 'Priority support', 'Deployment analytics'],
              cta: 'Go Pro',
              highlight: true,
            },
          ].map(plan => (
            <div key={plan.name} className={`relative p-8 rounded-3xl border ${plan.highlight ? 'border-violet-500/50 bg-violet-500/5 glow' : 'border-white/10 bg-white/[0.02]'}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-bold">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-gray-400 text-sm">/{plan.per}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleGoogleLogin}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.highlight ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:opacity-90' : 'border border-white/10 text-white hover:bg-white/5'}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4">Ready to host <span className="gradient-text">smarter?</span></h2>
          <p className="text-gray-400 mb-8">Join thousands of developers using Hoster++ to deploy faster.</p>
          <button
            onClick={handleGoogleLogin}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-violet-500/25 glow"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white" fillOpacity="0.9"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" fillOpacity="0.9"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white" fillOpacity="0.9"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" fillOpacity="0.9"/>
            </svg>
            Start Hosting Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-violet-400" />
          <span className="font-bold gradient-text">Hoster++</span>
        </div>
        <p>The advanced hosting platform. Clean domains. Instant deploy. AI-powered.</p>
      </footer>
    </div>
  )
}
