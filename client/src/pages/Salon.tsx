import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarClock } from 'lucide-react';

export default function Salon() {
  const [, navigate] = useLocation();

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
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Retour */}
        <Button
          variant="ghost"
          onClick={() => navigate('/events')}
          className="mb-8 text-accent hover:text-accent/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux événements
        </Button>

        {/* Titre */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-script text-5xl md:text-6xl text-accent mb-4">
            Salons &amp; Marchés
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Retrouvez Maelle Mars aux salons du bien-être et événements spirituels partout en France.
          </p>
        </div>

        {/* Message "prochainement" */}
        <div className="max-w-xl mx-auto text-center animate-fade-in-up">
          <div
            className="rounded-2xl border border-accent/30 p-10 flex flex-col items-center gap-6"
            style={{
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 40px rgba(184,134,11,0.15)',
            }}
          >
            <CalendarClock className="w-14 h-14 text-accent opacity-80" />
            <p
              className="text-2xl md:text-3xl font-light text-foreground"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              De nouveaux salons seront programmés prochainement.
            </p>
            <p className="text-muted-foreground text-sm">
              Revenez bientôt ou suivez Maelle sur les réseaux sociaux pour être informé(e) en avant-première.
            </p>
          </div>
        </div>

        {/* CTA organisateur */}
        <div className="mt-16 text-center animate-fade-in-up">
          <div
            className="inline-block rounded-2xl border border-accent/20 p-8"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
          >
            <h2 className="text-script text-3xl text-accent mb-3">
              Vous organisez un événement ?
            </h2>
            <p className="text-foreground/80 mb-6 max-w-md mx-auto">
              Maelle peut intervenir dans vos salons, marchés ou événements privés. Contactez-la pour discuter des modalités.
            </p>
            <Button
              onClick={() => navigate('/contact')}
              className="bg-accent hover:bg-accent/90 text-background font-semibold px-8 py-3"
            >
              Me Contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
