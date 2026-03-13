export default function Services() {
  const services = [
    {
      icon: '🔮',
      title: 'Voyance & Clairvoyance',
      text: 'Percevez les énergies invisibles qui guident votre vie. Chaque séance révèle ce que votre âme pressent déjà.',
      color: 'from-purple-500/10 to-violet-500/5',
      border: 'border-purple-500/20',
      glow: 'shadow-purple-500/10',
    },
    {
      icon: '🕯️',
      title: 'Contact avec les Défunts',
      text: "Retrouvez la paix à travers un message d’amour de ceux qui vous ont quittés. Une connexion douce et bienveillante.",
      color: 'from-amber-500/10 to-yellow-500/5',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
    },
    {
      icon: '✨',
      title: 'Guidance Spirituelle',
      text: 'Clarifiez vos choix, libérez vos doutes et avancez avec confiance sur le chemin qui vous est destiné.',
      color: 'from-blue-500/10 to-cyan-500/5',
      border: 'border-blue-500/20',
      glow: 'shadow-blue-500/10',
    },
  ];

  return (
    <section id="services" className="relative py-28 md:py-36 overflow-hidden bg-background">

      {/* Fond décoratif */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.05),transparent_60%)]" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">

        {/* En-tête asymétrique */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-end">
          <div>
            <p className="text-accent text-xs tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Mes Accompagnements
            </p>
            <h2
              className="text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight"
              style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', letterSpacing: '1px' }}
            >
              Pourquoi consulter<br />
              <span className="text-accent">une voyante ?</span>
            </h2>
          </div>
          <div className="lg:pb-4">
            <p
              className="text-xl text-foreground/70 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Une voyante vous aide à voir au-delà du visible, à écouter votre intuition et à clarifier vos choix. Elle éclaire votre chemin et révèle les possibilités que votre cœur pressent déjà.
            </p>
          </div>
        </div>

        {/* Cartes de services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className={`group relative bg-gradient-to-br ${service.color} border ${service.border} rounded-2xl p-8 hover:shadow-2xl ${service.glow} transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
            >
              {/* Halo au survol */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/2 transition-colors duration-500 rounded-2xl" />

              {/* Numéro discret */}
              <span
                className="absolute top-6 right-6 text-6xl font-bold text-white/3 select-none"
                style={{ fontFamily: "'Bodoni Moda', serif" }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Icône */}
              <div className="text-4xl mb-6">{service.icon}</div>

              {/* Titre */}
              <h3
                className="text-xl font-semibold text-foreground mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {service.title}
              </h3>

              {/* Texte */}
              <p
                className="text-foreground/70 leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem' }}
              >
                {service.text}
              </p>

              {/* Ligne décorative en bas */}
              <div className="mt-8 h-px bg-gradient-to-r from-accent/30 to-transparent" />
            </div>
          ))}
        </div>

        {/* CTA centré */}
        <div className="text-center mt-16">
          <a
            href="/consultations"
            className="inline-flex items-center gap-3 px-10 py-4 border border-accent/40 text-accent rounded-full hover:bg-accent/10 transition-all duration-300 hover:border-accent hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', letterSpacing: '0.05em' }}
          >
            <span>Découvrir mes consultations</span>
            <span className="text-accent">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
