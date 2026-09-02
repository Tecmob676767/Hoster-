import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import ProjectPage from './pages/ProjectPage'
import AITokenPage from './pages/AITokenPage'
import Layout from './components/Layout'
import PlumeLoader from './components/PlumeLoader'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: string
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [splashDone, setSplashDone] = useState(false)

  useEffect(() => {
    fetch('http://localhost:4000/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { if (data.authenticated) setUser(data.user) })
      .catch(() => {})
      .finally(() => setAuthLoading(false))
  }, [])

  const handleSplashDone = useCallback(() => setSplashDone(true), [])

  // Show plume animation on first load
  if (!splashDone) {
    return <PlumeLoader onDone={handleSplashDone} />
  }

  // While checking auth after splash
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
          <Route path="/project/:id" element={user ? <ProjectPage user={user} /> : <Navigate to="/" />} />
          <Route path="/project/:id/tokens" element={user ? <AITokenPage user={user} /> : <Navigate to="/" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
