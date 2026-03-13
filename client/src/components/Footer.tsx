import { Instagram, Phone } from 'lucide-react';

export default function Footer() {
  const footerPatternUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/footer-pattern_db494251.png';

  return (
    <footer
      className="relative bg-background border-t border-accent/20 py-16 md:py-20 overflow-hidden"
      style={{
        backgroundImage: `url('${footerPatternUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/85"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 items-center">
          {/* Logo et Tagline */}
          <div className="flex flex-col items-start">
            <h3 className="text-4xl font-bold text-accent mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
              Maelle Mars
            </h3>
            <p className="text-sm text-muted-foreground tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              MÉDIUM & CLAIRVOYANTE
            </p>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Trouvez clarté et sérénité à travers la guidance spirituelle
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Contactez-moi pour vos consultations
            </p>
            <a
              href="tel:+33646226610"
              className="inline-block px-6 py-3 bg-accent/10 border border-accent/40 rounded-lg text-accent font-semibold hover:bg-accent/20 hover:border-accent transition-all duration-300"
              style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.5px' }}
            >
              📞 06 46 22 66 10
            </a>
            <a
              href="mailto:maellemarsmedium@gmail.com"
              className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              ✉️ maellemarsmedium@gmail.com
            </a>
          </div>

          {/* Réseaux Sociaux — 3 icônes : Téléphone, Instagram, Facebook */}
          <div className="flex items-center justify-center md:justify-end gap-6">

            {/* 1. Téléphone — ouvre directement l'application d'appel */}
            <a
              href="tel:+33646226610"
              className="w-12 h-12 rounded-full border-2 border-accent/40 flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-all duration-300 hover:scale-110 text-accent"
              aria-label="Appeler Maelle Mars"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* 2. Instagram */}
            <a
              href="https://www.instagram.com/marsmaelle?utm_source=qr&igsh=eGEzOGFoZm1iNXBt"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border-2 border-accent/40 flex items-center justify-center hover:border-accent hover:scale-110 transition-all duration-300 bg-gradient-to-br from-purple-500 to-pink-500 border-transparent"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>

            {/* 3. Facebook — vrai logo avec couleur officielle */}
            <a
              href="https://www.facebook.com/maelle.mars"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border-2 border-transparent flex items-center justify-center hover:scale-110 transition-all duration-300 bg-[#1877F2]"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

          </div>
        </div>

        {/* Séparateur */}
        <div className="flex items-center justify-center gap-4 my-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/30"></div>
          <div className="text-accent/50" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.5rem' }}>✦</div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/30"></div>
        </div>

        {/* Copyright et Liens */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-sm" style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.5px' }}>
            &copy; 2026 Maelle Mars. Tous droits réservés.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <a href="/legal/mentions" className="hover:text-accent transition-colors duration-300">Mentions légales</a>
            <span>•</span>
            <a href="/legal/privacy" className="hover:text-accent transition-colors duration-300">Politique de confidentialité</a>
            <span>•</span>
            <a href="/legal/cgu" className="hover:text-accent transition-colors duration-300">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
