import { useLocation } from 'wouter';
import { Sparkles, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const PROMO_START = new Date('2026-03-01');
const PROMO_END = new Date('2026-04-01');

export default function PromoBanner() {
  const [, navigate] = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const isActive = now >= PROMO_START && now < PROMO_END;

  useEffect(() => {
    const updateHeight = () => {
      const h = (!isActive || dismissed) ? 0 : (bannerRef.current?.offsetHeight ?? 40);
      document.documentElement.style.setProperty('--promo-height', `${h}px`);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      document.documentElement.style.setProperty('--promo-height', '0px');
    };
  }, [isActive, dismissed]);

  if (!isActive || dismissed) return null;

  const handleClick = () => {
    navigate('/consultations');
  };

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 right-0 z-[60] cursor-pointer select-none"
      onClick={handleClick}
      role="banner"
      aria-label="Offre promotionnelle"
    >
      <div
        className="relative flex items-center justify-center gap-3 px-4 py-2.5 text-center"
        style={{
          background: 'linear-gradient(90deg, #7b0000 0%, #b8860b 30%, #dc143c 50%, #b8860b 70%, #7b0000 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
          boxShadow: '0 2px 12px rgba(220,20,60,0.5)',
        }}
      >
        {/* Étoiles décoratives */}
        <Sparkles className="w-4 h-4 text-yellow-300 shrink-0 animate-pulse" />

        <p className="text-white font-bold text-sm md:text-base tracking-wide">
          <span className="text-yellow-300">✦ CONSULTATION EXPRESS</span>
          {' '}—{' '}
          <span
            className="text-yellow-200 font-extrabold"
            style={{ textShadow: '0 0 8px rgba(255,215,0,0.8)' }}
          >
            15 € les 10 minutes
          </span>
          {' '}
          <span className="underline underline-offset-2 text-yellow-100 text-xs md:text-sm font-semibold">
            Réserver →
          </span>
        </p>

        <Sparkles className="w-4 h-4 text-yellow-300 shrink-0 animate-pulse" />

        {/* Bouton fermer */}
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
          aria-label="Fermer le bandeau"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
