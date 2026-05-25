import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Spawn trail particles
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          alpha: Math.random() * 0.6 + 0.4,
          life: 0,
          maxLife: Math.random() * 60 + 40,
        });
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    // Ambient particles
    const ambientParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
        life: 0,
        maxLife: Infinity,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(29, 43, 48, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Update and draw ambient particles
      ambientParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 210, 134, ${p.alpha})`;
        ctx.fill();
      });

      // Update and draw trail particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;

        const progress = p.life / p.maxLife;
        const alpha = p.alpha * (1 - progress);

        if (progress < 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + progress * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 210, 134, ${alpha})`;
          ctx.fill();

          // Glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4 * (1 - progress * 0.5), 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          gradient.addColorStop(0, `rgba(254, 210, 134, ${alpha * 0.3})`);
          gradient.addColorStop(1, 'rgba(254, 210, 134, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();

          return true;
        }
        return false;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const scrollToCollections = useCallback(() => {
    const el = document.getElementById('collections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: '#1d2b30' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pointer-events-none">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8 pointer-events-auto">
            <Sparkles size={14} className="text-[#fed286]" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              Spring Collection 2026
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-[12vw] md:text-[10vw] lg:text-[8vw] leading-[0.9] text-white mb-6 tracking-tight">
            Elevate
            <br />
            <span className="text-gradient">Your World</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-base md:text-lg text-white/60 max-w-lg mx-auto mb-10 leading-relaxed">
            Discover curated essentials crafted for those who appreciate the art of refined living.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
            <Link to="/collections" className="btn-primary flex items-center gap-2 px-8 py-4">
              Explore Collections
              <ArrowRight size={16} />
            </Link>
            <button onClick={scrollToCollections} className="btn-outline px-8 py-4">
              View Lookbook
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-[#fed286] rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
