import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../services/store';
import { Zap, LogOut, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

interface Props {
  user: User | null;
  setUser: (u: User | null) => void;
}

export default function Layout({ user, setUser }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    navigate('/');
  };

  const isProjectPage = location.pathname.startsWith('/project/');

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#121316]">
      {/* Top Navbar */}
      <nav className="border-b-2 border-[#121316] bg-[#FFFFFF] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Left: Brand + Breadcrumbs */}
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-2xl bg-[#F12850] text-white flex items-center justify-center shadow-[0_2px_0_#b31634] group-hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <span className="text-lg font-black text-[#121316] tracking-tight">
                  Hoster<span className="text-[#F12850]">++</span>
                </span>
              </Link>

              <ChevronRight className="w-4 h-4 text-[#E2E2DC]" />

              <Link
                to="/dashboard"
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                  !isProjectPage ? 'bg-[#121316] text-white' : 'text-[#666970] hover:text-[#121316] hover:bg-[#F4F4F0]'
                }`}
              >
                Dashboard
              </Link>
            </div>

            {/* Right: User Profile & Actions */}
            {user && (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 bg-[#F4F4F0] border border-[#E2E2DC] px-3 py-1 rounded-full text-xs font-bold text-[#121316]">
                  <span className="w-2 h-2 rounded-full bg-[#2AB09C] pulse-dot" />
                  <span>{user.plan}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#121316]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#121316] text-white flex items-center justify-center text-xs font-black">
                      {user.name[0]}
                    </div>
                  )}
                  <div className="hidden md:block">
                    <p className="text-xs font-bold text-[#121316] leading-none">{user.name}</p>
                    <p className="text-[10px] text-[#666970] font-medium mt-0.5">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl border border-[#E2E2DC] text-[#666970] hover:text-[#F12850] hover:border-[#F12850] hover:bg-[#F12850]/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
