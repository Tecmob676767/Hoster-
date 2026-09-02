import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number; maxLife: number
  size: number
  hue: number; opacity: number
}

export default function PlumeLoader({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number
    let elapsed = 0
    const DURATION = 3200 // ms before calling onDone
    let lastTime = performance.now()

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = []

    const spawn = (x: number, y: number, burst = false) => {
      const count = burst ? 18 : 3
      for (let i = 0; i < count; i++) {
        const angle = burst
          ? (Math.PI * 2 * i) / count + Math.random() * 0.4
          : -Math.PI / 2 + (Math.random() - 0.5) * 1.2
        const speed = burst
          ? 2 + Math.random() * 5
          : 0.5 + Math.random() * 2.5
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (burst ? 0 : 1),
          life: 0,
          maxLife: 60 + Math.random() * 80,
          size: 2 + Math.random() * 4,
          hue: 260 + Math.random() * 80, // violet → cyan range
          opacity: 0,
        })
      }
    }

    const cx = () => canvas.width / 2
    const cy = () => canvas.height / 2

    let frame = 0
    let burstDone = false

    const draw = (now: number) => {
      const dt = now - lastTime
      lastTime = now
      elapsed += dt
      frame++

      // Fade out canvas
      ctx.fillStyle = 'rgba(10,10,10,0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Spawn from center plume
      if (elapsed < DURATION - 600) {
        spawn(
          cx() + (Math.random() - 0.5) * 10,
          cy() + 20
        )
      }

      // Burst at the moment logo appears (~600ms)
      if (!burstDone && elapsed > 600) {
        burstDone = true
        spawn(cx(), cy(), true)
      }

      // Update + draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.03 // slight upward drift
        p.vx *= 0.98

        const progress = p.life / p.maxLife
        p.opacity = progress < 0.2
          ? progress / 0.2
          : 1 - (progress - 0.2) / 0.8
        p.size *= 0.995

        if (p.life >= p.maxLife || p.size < 0.3) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = p.opacity * 0.85
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
        grad.addColorStop(0, `hsla(${p.hue},90%,75%,1)`)
        grad.addColorStop(1, `hsla(${p.hue},90%,55%,0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Draw logo / text — fades in after 400ms
      if (elapsed > 400) {
        const textAlpha = Math.min(1, (elapsed - 400) / 400)
        ctx.save()
        ctx.globalAlpha = textAlpha

        // Glow behind text
        ctx.shadowColor = '#8b5cf6'
        ctx.shadowBlur = 40

        // Hoster++ logo text
        ctx.font = `bold ${Math.round(canvas.width * 0.07)}px system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const grad2 = ctx.createLinearGradient(cx() - 120, 0, cx() + 120, 0)
        grad2.addColorStop(0, '#8b5cf6')
        grad2.addColorStop(0.5, '#06b6d4')
        grad2.addColorStop(1, '#10b981')
        ctx.fillStyle = grad2
        ctx.fillText('Hoster++', cx(), cy() - 10)

        // Tagline
        ctx.shadowBlur = 0
        ctx.font = `${Math.round(canvas.width * 0.018)}px system-ui, sans-serif`
        ctx.fillStyle = `rgba(150,150,170,${textAlpha})`
        ctx.fillText('Deploy anything. Instantly.', cx(), cy() + Math.round(canvas.width * 0.06))
        ctx.restore()
      }

      // Loading bar — appears at 900ms
      if (elapsed > 900) {
        const barAlpha = Math.min(1, (elapsed - 900) / 300)
        const barProgress = Math.min(1, (elapsed - 900) / (DURATION - 900 - 200))
        const barW = canvas.width * 0.28
        const barH = 3
        const barX = cx() - barW / 2
        const barY = cy() + Math.round(canvas.width * 0.09)

        ctx.save()
        ctx.globalAlpha = barAlpha * 0.4
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.roundRect(barX, barY, barW, barH, 99)
        ctx.fill()

        ctx.globalAlpha = barAlpha
        const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0)
        barGrad.addColorStop(0, '#8b5cf6')
        barGrad.addColorStop(1, '#06b6d4')
        ctx.fillStyle = barGrad
        ctx.shadowColor = '#8b5cf6'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.roundRect(barX, barY, barW * barProgress, barH, 99)
        ctx.fill()
        ctx.restore()
      }

      // Fade out whole canvas near the end
      if (elapsed > DURATION - 400) {
        const fadeOut = Math.min(1, (elapsed - (DURATION - 400)) / 400)
        ctx.save()
        ctx.globalAlpha = fadeOut
        ctx.fillStyle = '#0a0a0a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.restore()
      }

      if (elapsed >= DURATION) {
        cancelAnimationFrame(animId)
        onDone()
        return
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [onDone])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a]"
      style={{ display: 'block' }}
    />
  )
}
