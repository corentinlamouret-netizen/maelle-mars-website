export function RealisticCandle() {
  return (
    <svg
      viewBox="0 0 100 140"
      className="w-12 h-12"
      style={{
        filter: 'drop-shadow(0 0 8px rgba(217, 119, 6, 0.4))',
      }}
    >
      <defs>
        <linearGradient id="candleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f5e6d3" />
          <stop offset="50%" stopColor="#fffacd" />
          <stop offset="100%" stopColor="#f5e6d3" />
        </linearGradient>

        <radialGradient id="flameGradient" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#ffff99" stopOpacity="1" />
          <stop offset="40%" stopColor="#ffcc00" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#ff9900" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
        </radialGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>{`
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            25% { opacity: 0.95; }
            50% { opacity: 1; }
            75% { opacity: 0.92; }
          }
          
          @keyframes sway {
            0%, 100% { transform: translateX(0px) scaleY(1); }
            25% { transform: translateX(1px) scaleY(1.02); }
            50% { transform: translateX(-1px) scaleY(0.98); }
            75% { transform: translateX(0.5px) scaleY(1.01); }
          }
          
          .flame {
            animation: flicker 3s infinite, sway 2.5s infinite;
            transform-origin: 50% 100%;
          }
        `}</style>
      </defs>

      {/* Bougie */}
      <rect x="30" y="50" width="40" height="60" rx="3" fill="url(#candleGradient)" />

      {/* Ombre de la bougie */}
      <ellipse cx="50" cy="110" rx="18" ry="4" fill="rgba(0,0,0,0.1)" />

      {/* Mèche */}
      <line x1="50" y1="50" x2="50" y2="25" stroke="#8b7355" strokeWidth="1.5" />

      {/* Flamme externe (orange) */}
      <path
        className="flame"
        d="M 50 25 Q 45 10 48 0 Q 50 5 50 0 Q 50 5 52 0 Q 55 10 50 25"
        fill="url(#flameGradient)"
        filter="url(#glow)"
      />

      {/* Flamme interne (jaune) */}
      <path
        className="flame"
        d="M 50 22 Q 47 12 49 5 Q 50 8 50 5 Q 50 8 51 5 Q 53 12 50 22"
        fill="#ffff99"
        opacity="0.8"
        style={{ animationDelay: '-0.5s' }}
      />

      {/* Reflet sur la bougie */}
      <ellipse cx="38" cy="70" rx="4" ry="12" fill="white" opacity="0.3" />
    </svg>
  );
}
