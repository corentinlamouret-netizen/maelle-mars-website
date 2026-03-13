export default function HomeInvitation() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-background">

      {/* Fond étoilé */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/3 to-background" />
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-accent animate-pulse"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3 + 0.1,
            animationDuration: `${Math.random() * 4 + 3}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">

          {/* Ornement */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/50" />
            <span className="text-accent text-2xl">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/50" />
          </div>

          {/* Titre */}
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight"
            style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', letterSpacing: '1px' }}
          >
            Prête à recevoir<br />
            <span className="text-accent">votre guidance ?</span>
          </h2>

          {/* Sous-titre */}
          <p
            className="text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: '300' }}
          >
            Chaque âme mérite d'être entendue. Chaque chemin mérite d'être éclairé. Rejoignez les centaines de personnes qui ont trouvé clarté et sérénité.
          </p>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <a
              href="/consultations"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-accent text-background font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:scale-105"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', letterSpacing: '0.08em' }}
            >
              <span className="relative z-10">Réserver une consultation</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </a>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-5 border border-accent/40 text-accent rounded-full hover:bg-accent/10 transition-all duration-300 hover:border-accent"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', letterSpacing: '0.05em' }}
            >
              Me contacter
            </a>
          </div>

          {/* Signature */}
          <div className="pt-8">
            <p
              className="text-3xl text-accent/80"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              Maelle Mars
            </p>
            <p className="text-foreground/40 text-xs tracking-widest uppercase mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Médium & Clairvoyante
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
