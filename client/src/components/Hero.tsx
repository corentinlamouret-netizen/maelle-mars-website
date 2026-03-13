import { useEffect, useRef } from 'react';
import { Instagram, Facebook, ChevronDown } from 'lucide-react';

export default function Hero() {
  const heroBackgroundUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp';

  const mediumPortraitUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/maelle-portrait-official_6340148e.png';

  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollY = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden flex flex-col">

      {/* ─── FOND PARALLAXE ─── */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: `url('${heroBackgroundUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          willChange: 'transform',
        }}
      />

      {/* Couches de superposition */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

      {/* Étoiles animées */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.2,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* ─── CONTENU PRINCIPAL ─── */}
      <div className="relative z-10 flex-1 flex items-center pt-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[80vh]">

            {/* Colonne gauche — Texte principal */}
            <div className="lg:col-span-7 space-y-8">

              {/* Badge mystique */}
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-accent/40 rounded-full bg-accent/5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-accent text-xs tracking-widest uppercase font-medium">Médium & Clairvoyante</span>
              </div>

              {/* Titre principal */}
              <div>
                <h1
                  className="text-7xl sm:text-8xl md:text-9xl text-white leading-none"
                  style={{
                    fontFamily: "'Bodoni Moda', serif",
                    fontStyle: 'italic',
                    fontWeight: '400',
                    letterSpacing: '-1px',
                    textShadow: '0 0 60px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  Maelle
                </h1>
                <h1
                  className="text-7xl sm:text-8xl md:text-9xl text-accent leading-none -mt-2"
                  style={{
                    fontFamily: "'Bodoni Moda', serif",
                    fontStyle: 'italic',
                    fontWeight: '400',
                    letterSpacing: '-1px',
                    textShadow: '0 0 80px rgba(212, 175, 55, 0.5)',
                  }}
                >
                  Mars
                </h1>
              </div>

              {/* Ligne décorative avec texte */}
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-accent/60" />
                <p
                  className="text-white/70 text-sm tracking-[0.3em] uppercase"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Connexion · Lumière · Vérité
                </p>
              </div>

              {/* Citation */}
              <blockquote
                className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-xl"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontWeight: '300',
                }}
              >
                « Un message peut changer votre chemin. »
              </blockquote>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                <a
                  href="/consultations"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 bg-accent text-background font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', letterSpacing: '0.05em' }}
                >
                  <span className="relative z-10">Prendre rendez-vous</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                </a>

                {/* Réseaux sociaux */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/marsmaelle?utm_source=qr&igsh=eGEzOGFoZm1iNXBt"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de Maelle Mars"
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-purple-500/30"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="https://www.facebook.com/maelle.mars"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook de Maelle Mars"
                    className="w-11 h-11 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-500/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Colonne droite — Portrait + Encadré */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-6">

              {/* Portrait avec cadre doré */}
              <div className="relative w-72 lg:w-80">
                {/* Halo lumineux derrière */}
                <div className="absolute -inset-4 bg-accent/10 rounded-3xl blur-2xl" />

                {/* Cadre décoratif rotatif */}
                <div className="absolute inset-0 border border-accent/30 rounded-2xl rotate-3 scale-105" />
                <div className="absolute inset-0 border border-accent/15 rounded-2xl -rotate-2 scale-102" />

                {/* Image */}
                <img
                  src={mediumPortraitUrl}
                  alt="Maelle Mars — Médium & Clairvoyante"
                  className="relative z-10 w-full rounded-2xl shadow-2xl shadow-black/60 object-cover"
                  style={{ aspectRatio: '3/4', objectFit: 'cover' }}
                />

                {/* Badge flottant */}
                <div className="absolute -bottom-4 -left-4 z-20 bg-card border border-accent/40 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm">
                  <p className="text-accent text-xs font-semibold tracking-wider uppercase">✦ Guidance authentique</p>
                </div>
              </div>

              {/* Encadré de remerciement */}
              <div className="bg-white/5 backdrop-blur-md border border-accent/20 rounded-2xl px-6 py-4 text-center w-72 lg:w-80 shadow-xl">
                <p
                  className="text-white/80 text-lg"
                  style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.5px' }}
                >
                  Je vous remercie d'être passé <span className="text-red-400">❤️</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── SCROLL INDICATOR ─── */}
      <div className="relative z-10 flex justify-center pb-8 animate-bounce">
        <div className="flex flex-col items-center gap-1 text-white/40">
          <span className="text-xs tracking-widest uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>Découvrir</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

    </section>
  );
}
