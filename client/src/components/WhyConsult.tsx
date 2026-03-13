export default function WhyConsult() {
  const reasons = [
    {
      icon: '👶',
      title: 'Don depuis l\'enfance',
      description: 'Une sensibilité spirituelle développée depuis le plus jeune âge, cultivée et perfectionnée au fil des années.',
    },
    {
      icon: '🎤',
      title: 'Conférences & Salons',
      description: 'Expérience reconnue dans les événements spirituels majeurs et conférences de prestige.',
    },
    {
      icon: '💚',
      title: 'Approche Bienveillante',
      description: 'Une écoute compassionate et respectueuse de votre parcours unique et de vos émotions.',
    },
    {
      icon: '✨',
      title: 'Réponses Sincères',
      description: 'Des messages authentiques et des réponses sans détour, toujours dans votre intérêt.',
    },
  ];

  return (
    <section id="why" className="relative py-24 md:py-32 overflow-hidden">
      {/* Fond avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-background to-secondary/5"></div>

      {/* Décoration */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <p className="text-accent text-lg mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '2px' }}>
            MES ATOUTS
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pourquoi me consulter ?
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/30"></div>
            <div className="text-accent/50" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.5rem' }}>✦</div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/30"></div>
          </div>
        </div>

        {/* Grille de raisons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Carte de raison */}
              <div className="relative h-full bg-card border border-accent/20 rounded-xl p-8 text-center transition-all duration-500 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 flex flex-col items-center justify-center">
                {/* Icône */}
                <div className="text-6xl mb-6 transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
                  {reason.icon}
                </div>

                {/* Titre */}
                <h3 className="text-xl font-semibold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {reason.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem' }}>
                  {reason.description}
                </p>

                {/* Ligne décorative au survol */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Section bonus */}
        <div className="mt-16 pt-12 border-t border-accent/20">
          <div className="text-center space-y-6">
            <p className="text-lg text-muted-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Chaque consultation est une expérience personnalisée adaptée à vos besoins spécifiques
            </p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                <span className="text-sm text-muted-foreground" style={{ fontFamily: "'Montserrat', sans-serif" }}>Confidentialité garantie</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏰</span>
                <span className="text-sm text-muted-foreground" style={{ fontFamily: "'Montserrat', sans-serif" }}>Disponibilités flexibles</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌍</span>
                <span className="text-sm text-muted-foreground" style={{ fontFamily: "'Montserrat', sans-serif" }}>Consultations en ligne</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton CTA */}
        <div className="mt-12 text-center">
          <a href="/consultations" className="inline-block btn-golden">
            Prendre une consultation
          </a>
        </div>
      </div>
    </section>
  );
}
