import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
  color: string;
  scaleX: number;
}

const PlumineCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const petalsRef = useRef<Petal[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Plum blossom / glowing plumine petals palette (violet, magenta, rose, electric cyan & amber sheen)
    const colors = [
      '#a855f7', '#c084fc', '#d946ef', '#f472b6', '#e879f9',
      '#818cf8', '#38bdf8', '#fb7185', '#f43f5e', '#c4b5fd'
    ];

    const createPetal = (fromTop = true): Petal => ({
      x: Math.random() * canvas.width,
      y: fromTop ? -20 - Math.random() * 100 : Math.random() * canvas.height,
      size: 4 + Math.random() * 9,
      speedX: (Math.random() - 0.5) * 1.8,
      speedY: 0.6 + Math.random() * 1.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.08,
      opacity: 0.35 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.012 + Math.random() * 0.025,
      color: colors[Math.floor(Math.random() * colors.length)],
      scaleX: 0.55 + Math.random() * 0.45,
    });

    petalsRef.current = Array.from({ length: 75 }, () => createPetal(false));

    const drawPetal = (context: CanvasRenderingContext2D, p: Petal) => {
      context.save();
      context.translate(p.x, p.y);
      context.rotate(p.rotation);
      context.scale(p.scaleX, 1);
      context.globalAlpha = p.opacity;
      context.fillStyle = p.color;
      context.beginPath();
      context.moveTo(0, -p.size);
      context.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
      context.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
      context.fill();

      // Highlight sheen
      context.globalAlpha = p.opacity * 0.35;
      context.fillStyle = '#ffffff';
      context.beginPath();
      context.ellipse(-p.size * 0.25, -p.size * 0.3, p.size * 0.3, p.size * 0.15, -0.5, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    let windTime = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      windTime += 0.008;
      const windForce = Math.sin(windTime) * 1.2;

      petalsRef.current.forEach((p, i) => {
        p.wobble += p.wobbleSpeed;
        p.x += (p.speedX + Math.sin(p.wobble) * 0.85 + windForce);
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        drawPetal(ctx, p);

        if (p.y > canvas.height + 30 || p.x < -60 || p.x > canvas.width + 60) {
          petalsRef.current[i] = createPetal(true);
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="plumine-canvas"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};

export default PlumineCanvas;
