/**
 * Composant Bougie animée avec flamme qui bouge
 */

export default function AnimatedCandle() {
  return (
    <div className="fixed bottom-8 right-8 z-20">
      {/* Conteneur de la bougie */}
      <div className="relative w-16 h-32 flex items-end justify-center">
        {/* Flamme animée */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-candle-flame">
          {/* Flamme extérieure (orange) */}
          <div className="absolute inset-0 w-6 h-8 bg-gradient-to-t from-orange-500 via-orange-400 to-yellow-300 rounded-full blur-sm opacity-80 animate-pulse"></div>
          
          {/* Flamme intérieure (jaune) */}
          <div className="absolute inset-1 w-4 h-6 bg-gradient-to-t from-yellow-400 via-yellow-300 to-white rounded-full blur-xs opacity-90"></div>
          
          {/* Lueur de la flamme */}
          <div className="absolute -inset-3 w-12 h-10 bg-yellow-300 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        </div>

        {/* Cire de la bougie */}
        <div className="relative w-6 h-20 bg-gradient-to-b from-amber-100 to-amber-200 rounded-b-lg shadow-lg">
          {/* Reflet sur la cire */}
          <div className="absolute top-2 left-1 w-1 h-8 bg-white opacity-30 rounded-full blur-sm"></div>
        </div>

        {/* Ombre sous la bougie */}
        <div className="absolute bottom-0 w-8 h-2 bg-black/20 rounded-full blur-md"></div>
      </div>

      {/* Texte informatif */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center text-xs text-amber-200 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
        Lumière mystique
      </div>
    </div>
  );
}

/**
 * Styles CSS pour l'animation de la bougie
 * À ajouter dans index.css
 */
const candleStyles = `
@keyframes candleFlame {
  0%, 100% {
    transform: translateY(0px) scaleX(1);
  }
  25% {
    transform: translateY(-2px) scaleX(0.95);
  }
  50% {
    transform: translateY(-4px) scaleX(1.05);
  }
  75% {
    transform: translateY(-1px) scaleX(0.98);
  }
}

.animate-candle-flame {
  animation: candleFlame 2s ease-in-out infinite;
}
`;

export { candleStyles };
