export default function SectionDivider() {
  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Fond avec gradient subtil */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-accent/5 to-background"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Première ligne dorée */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"></div>

          {/* Bulle or unique */}
          <a 
            href="/consultations"
            className="bg-accent text-background hover:bg-accent/90 transition-all duration-300 rounded-full px-12 py-4 font-semibold shadow-lg shadow-accent/30 inline-block"
            style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.1rem' }}
          >
            Une question ? Je prends rendez-vous
          </a>

          {/* Deuxième ligne dorée */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
