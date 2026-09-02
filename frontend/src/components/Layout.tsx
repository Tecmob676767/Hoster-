import { Outlet, Link, useNavigate } from 'react-router-dom'
import { User } from '../App'
import { Zap, LogOut, LayoutDashboard } from 'lucide-react'

interface Props {
  user: User | null
  setUser: (u: User | null) => void
}

export default function Layout({ user, setUser }: Props) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await fetch('http://localhost:4000/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0d0d0d]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg gradient-border p-[1px]">
                <div className="w-full h-full bg-[#0d0d0d] rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-violet-400" />
                </div>
              </div>
              <span className="font-bold text-lg gradient-text">Hoster++</span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </div>

            {/* User */}
            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-white/10" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold">
                      {user.name[0]}
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white leading-none">{user.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user.plan}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
