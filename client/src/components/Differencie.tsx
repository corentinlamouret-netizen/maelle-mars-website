export default function Differencie() {
  const traits = [
    { icon: '🌙', label: 'Ressenti profond', desc: 'Je ne lis pas l\'avenir, je ressens votre âme.' },
    { icon: '💜', label: 'Connexion vibratoire', desc: 'Chaque guidance est unique et centrée sur votre lumière.' },
    { icon: '🕊️', label: 'Approche douce', desc: 'Douceur, profondeur et authenticité à chaque séance.' },
    { icon: '⭐', label: 'Énergie pure', desc: 'Une connexion sincère à votre énergie intérieure.' },
  ];

  return (
    <section id="differencie" className="relative py-28 md:py-36 overflow-hidden bg-background">

      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,175,55,0.06),transparent_60%)]" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Colonne gauche — Titre et traits */}
          <div className="space-y-10">
            <div>
              <p className="text-accent text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Mon Approche
              </p>
              <h2
                className="text-5xl md:text-6xl font-light text-foreground leading-tight"
                style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', letterSpacing: '1px' }}
              >
                Ce qui me<br />
                <span className="text-accent">différencie</span>
              </h2>
            </div>

            {/* Traits distinctifs */}
            <div className="space-y-6">
              {traits.map((trait, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-accent/20 transition-colors duration-300">
                    {trait.icon}
                  </div>
                  <div>
                    <h4
                      className="text-foreground font-semibold mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {trait.label}
                    </h4>
                    <p
                      className="text-foreground/60 text-sm leading-relaxed"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem' }}
                    >
                      {trait.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne droite — Citation grande */}
          <div className="relative">
            {/* Cadre décoratif */}
            <div className="absolute -inset-4 border border-accent/10 rounded-3xl rotate-1" />
            <div className="absolute -inset-4 border border-accent/5 rounded-3xl -rotate-1" />

            <div className="relative bg-white/3 backdrop-blur-sm border border-accent/20 rounded-2xl p-10 md:p-14 shadow-2xl">
              {/* Guillemets décoratifs */}
              <div
                className="text-8xl text-accent/20 leading-none mb-4 select-none"
                style={{ fontFamily: "'Bodoni Moda', serif" }}
              >
                "
              </div>

              <blockquote
                className="text-2xl md:text-3xl text-foreground leading-relaxed mb-8"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: '300' }}
              >
                Je ne me contente pas de lire l'avenir, je ressens votre âme. Chaque guidance est unique, vibratoire, et centrée sur votre lumière intérieure.
              </blockquote>

              <div className="flex items-center gap-4 pt-6 border-t border-accent/20">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm">
                  ✦
                </div>
                <div>
                  <p
                    className="text-accent font-semibold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Maelle Mars
                  </p>
                  <p className="text-foreground/50 text-xs tracking-wider uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Médium & Clairvoyante
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
