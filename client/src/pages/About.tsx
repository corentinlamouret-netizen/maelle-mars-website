export default function About() {
  const mediumPortraitUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/maelle-portrait-official_6340148e.png';

  const heroBackgroundUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp';

  return (
    <div
      className="min-h-screen pt-24 pb-12 relative overflow-hidden"
      style={{
        backgroundImage: `url('${heroBackgroundUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="flex justify-center items-center order-2 lg:order-1">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 border-2 border-accent/30 rounded-lg transform -rotate-3"></div>
              <img
                src={mediumPortraitUrl}
                alt="Maelle Mars"
                className="w-full rounded-lg shadow-2xl relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent rounded-lg"></div>
            </div>
          </div>

          {/* Contenu */}
          <div className="space-y-6 order-1 lg:order-2 animate-fade-in-up">
            <div>
              <h1 className="text-script text-5xl md:text-6xl text-accent mb-2">
                À propos
              </h1>
              <h2 className="text-3xl text-foreground font-light">
                Maelle Mars
              </h2>
              <p className="text-lg text-muted-foreground">
                Médium & Clairvoyante
              </p>
            </div>

            <div className="divider-golden"></div>

            <p className="text-foreground text-lg leading-relaxed">
              Depuis mon plus jeune âge, je possède des dons de clairvoyance et de médiumnité qui m'ont permis d'aider de nombreuses personnes à trouver des réponses et à avancer sur leur chemin de vie. Ma sensibilité spirituelle m'a guidée vers cette vocation de médium et de guide spirituel.
            </p>

            <p className="text-foreground text-lg leading-relaxed">
              À travers mes consultations, je vous aide à recevoir des messages de l'au-delà, à obtenir des réponses claires à vos questions et à bénéficier d'une guidance spirituelle profonde. Je pratique avec bienveillance, respect et confidentialité.
            </p>

            <button className="btn-golden mt-8">
              Prendre rendez-vous
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
