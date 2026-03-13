import { useState, useEffect } from 'react';

const temoignages = [
  {
    texte: "Maelle a su mettre des mots sur ce que je ressentais sans que je lui dise quoi que ce soit. Une expérience bouleversante et apaisante à la fois.",
    auteur: "Sophie L.",
    ville: "Montpellier",
    etoiles: 5,
  },
  {
    texte: "J'ai eu un contact avec ma maman décédée. Les messages étaient si précis, si personnels... Je suis repartie avec une paix que je n'avais pas connue depuis des années.",
    auteur: "Marie-Claire D.",
    ville: "Perpignan",
    etoiles: 5,
  },
  {
    texte: "Une guidance d'une justesse incroyable. Maelle perçoit des choses que personne ne pouvait savoir. Je recommande à toute personne en quête de réponses.",
    auteur: "Isabelle R.",
    ville: "Toulouse",
    etoiles: 5,
  },
];

export default function HomeTemoignages() {
  const [actif, setActif] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActif((prev) => (prev + 1) % temoignages.length);
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const temoignage = temoignages[actif];

  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-background">

      {/* Fond avec texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04),transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">

        {/* En-tête */}
        <div className="text-center mb-16">
          <p className="text-accent text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Ils témoignent
          </p>
          <h2
            className="text-5xl md:text-6xl font-light text-foreground"
            style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', letterSpacing: '1px' }}
          >
            Ce qu'ils vivent
          </h2>
        </div>

        {/* Témoignage central animé */}
        <div className="max-w-3xl mx-auto">
          <div
            className="relative bg-white/3 backdrop-blur-sm border border-accent/20 rounded-2xl p-10 md:p-16 shadow-2xl text-center transition-opacity duration-400"
            style={{ opacity: fade ? 1 : 0 }}
          >
            {/* Étoiles */}
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(temoignage.etoiles)].map((_, i) => (
                <span key={i} className="text-accent text-xl">★</span>
              ))}
            </div>

            {/* Guillemet */}
            <div
              className="text-7xl text-accent/20 leading-none mb-4 select-none"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              "
            </div>

            {/* Texte */}
            <blockquote
              className="text-xl md:text-2xl text-foreground/90 leading-relaxed mb-10"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: '300' }}
            >
              {temoignage.texte}
            </blockquote>

            {/* Auteur */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-accent/40" />
              <p
                className="text-accent font-semibold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {temoignage.auteur}
              </p>
              <span className="text-foreground/30 text-sm">·</span>
              <p className="text-foreground/50 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {temoignage.ville}
              </p>
              <div className="w-8 h-px bg-accent/40" />
            </div>
          </div>

          {/* Indicateurs */}
          <div className="flex justify-center gap-2 mt-8">
            {temoignages.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFade(false); setTimeout(() => { setActif(i); setFade(true); }, 300); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === actif ? 'w-8 bg-accent' : 'w-2 bg-accent/30'}`}
                aria-label={`Témoignage ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Lien vers tous les témoignages */}
        <div className="text-center mt-12">
          <a
            href="/temoignages"
            className="text-accent/70 hover:text-accent text-sm tracking-wider uppercase transition-colors duration-300"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Voir tous les témoignages →
          </a>
        </div>
      </div>
    </section>
  );
}
