export default function CTA() {
  return (
    <section id="cta" className="relative py-32 md:py-40 overflow-hidden">
      {/* Fond avec gradient luxe */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-background to-secondary/10"></div>
      
      {/* Décoration de particules animées */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-2 h-2 bg-accent rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-20 w-1.5 h-1.5 bg-accent rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-accent rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-accent rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Orbes de lumière */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-10 animate-fade-in-up">
          {/* Étiquette */}
          <p className="text-accent text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '2px' }}>
            PRÊT À AVANCER ?
          </p>

          {/* Titre principal */}
          <h2 className="text-6xl md:text-7xl font-bold text-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ne restez pas dans le doute.
          </h2>

          {/* Sous-titre */}
          <p className="text-2xl text-muted-foreground leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Recevez vos réponses dès aujourd'hui et découvrez la clarté que vous recherchez.
          </p>

          {/* Séparateur élégant */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/30"></div>
            <div className="text-accent/50" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.5rem' }}>✦</div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/30"></div>
          </div>

          {/* CTA Button avec animation */}
          <div className="pt-4">
            <a 
              href="/booking" 
              className="inline-block px-12 py-5 bg-gradient-to-r from-accent to-accent/80 text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-accent/40 hover:scale-105 text-lg"
              style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '1px' }}
            >
              Réserver une consultation
            </a>
          </div>

          {/* Texte secondaire */}
          <p className="text-muted-foreground text-sm pt-4" style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.5px' }}>
            Consultations disponibles en ligne et en personne
          </p>
        </div>
      </div>
    </section>
  );
}
