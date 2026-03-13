export default function Testimonials() {
  const testimonials = [
    {
      quote: 'Grâce à Maelle, j\'ai enfin trouvé la paix intérieure et une clarté que je recherchais depuis longtemps. Merci infiniment !',
      author: 'Sophie M.',
      rating: 5,
    },
    {
      quote: 'Des messages précis et réconfortants. Une expérience incroyable qui a transformé ma perspective sur la vie.',
      author: 'Julien D.',
      rating: 5,
    },
    {
      quote: 'Maelle a changé ma vie. Je me sens enfin guidée et en paix avec mon passé.',
      author: 'Martine L.',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden">
      {/* Fond avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-background to-secondary/5"></div>
      
      {/* Décoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <p className="text-accent text-lg mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '2px' }}>
            TÉMOIGNAGES
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ce que disent mes clients
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/30"></div>
            <div className="text-accent/50" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.5rem' }}>✦</div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/30"></div>
          </div>
        </div>

        {/* Grille de témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Carte de témoignage */}
              <div className="relative h-full bg-card border border-accent/20 rounded-xl p-8 transition-all duration-500 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2">
                {/* Guillemets décoratives */}
                <div className="absolute top-6 right-8 text-6xl text-accent/10 font-serif">❝</div>

                {/* Étoiles de notation */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-accent text-lg">★</span>
                  ))}
                </div>

                {/* Citation */}
                <p className="text-lg leading-relaxed mb-8 text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic' }}>
                  "{testimonial.quote}"
                </p>

                {/* Séparateur */}
                <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-6"></div>

                {/* Auteur */}
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground" style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.5px' }}>
                    {testimonial.author}
                  </p>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                </div>

                {/* Ligne décorative au survol */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 pt-8 border-t border-accent/20">
          <p className="text-muted-foreground mb-6 text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Rejoignez nos clients satisfaits et découvrez votre propre transformation
          </p>
          <a 
            href="/submit-testimonial" 
            className="inline-block px-8 py-4 border-2 border-accent text-accent font-semibold rounded-lg transition-all duration-300 hover:bg-accent hover:text-primary-foreground hover:shadow-lg"
            style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.5px' }}
          >
            Partager mon témoignage
          </a>
        </div>
      </div>
    </section>
  );
}
