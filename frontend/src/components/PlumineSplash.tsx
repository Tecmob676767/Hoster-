import { useEffect, useState } from 'react';
import PlumineCanvas from './PlumineCanvas';
import { Zap } from 'lucide-react';

interface Props {
  onDone: () => void;
}

export default function PlumineSplash({ onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const duration = 2400; // 2.4s splash

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const current = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setFading(true);
        setTimeout(() => {
          onDone();
        }, 500);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <PlumineCanvas />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Glowing Logo Container */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-400 p-[2px] shadow-[0_0_50px_rgba(168,85,247,0.5)] animate-pulse">
            <div className="w-full h-full bg-[#0d0d0d] rounded-3xl flex items-center justify-center">
              <Zap className="w-10 h-10 text-violet-400" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Hoster++
          </span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base font-medium mb-8">
          Deploy anything. Custom domains only.
        </p>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 h-2 bg-white/10 rounded-full overflow-hidden p-[1px] border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 rounded-full transition-all duration-75 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 font-mono mt-3">
          Loading platform {progress}%
        </span>
      </div>
    </div>
  );
}
