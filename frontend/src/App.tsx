import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ProjectPage from './pages/ProjectPage';
import AITokenPage from './pages/AITokenPage';
import Layout from './components/Layout';
import { api } from './services/api';
import type { User } from './services/store';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Zero-localhost: uses api service with resilient local store sync
    api.getCurrentUser()
      .then(u => {
        setUser(u);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  const handleLoginSuccess = (u: User) => {
    setUser(u);
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#F12850] border-t-transparent animate-spin" />
        <p className="text-xs font-black uppercase tracking-wider text-[#121316] mt-4">
          Booting Hoster++ Studio...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Landing
              user={user}
              onLoginSuccess={handleLoginSuccess}
              onLogout={handleLogout}
            />
          }
        />
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/project/:id"
            element={
              user ? (
                <ProjectPage user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/project/:id/tokens"
            element={
              user ? (
                <AITokenPage user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
