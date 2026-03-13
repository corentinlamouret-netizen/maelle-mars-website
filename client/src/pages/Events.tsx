import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic2, Users } from 'lucide-react';

export default function Events() {
  const [, navigate] = useLocation();
  const heroBackgroundUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp';

  const mediumPortraitUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/maelle-portrait-official_6340148e.png';

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <div
        className="min-h-[50vh] pt-24 pb-12 relative overflow-hidden"
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
            {/* Contenu */}
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h1 className="text-script text-5xl md:text-6xl text-accent mb-4">
                  Événements
                </h1>
                <h2 className="text-3xl text-foreground font-light">
                  Rencontres spirituelles et moments de partage.
                </h2>
              </div>

              <div className="divider-golden"></div>

              <p className="text-foreground text-lg leading-relaxed">
                Tout au long de l'année, je participe à des conférences, salons du bien-être et événements spirituels en ligne. À travers ces rencontres, je m'adresse à celles et ceux qui ressentent le besoin d'un message, d'une guidance ou d'un moment d'échange.
              </p>

              <p className="text-foreground text-lg leading-relaxed">
                Ces événements sont des occasions privilégiées de partager mon expérience, de répondre à vos questions et de créer des moments de connexion spirituelle authentiques.
              </p>
            </div>

            {/* Image */}
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 border-2 border-accent/30 rounded-lg transform rotate-3"></div>
                <img
                  src={mediumPortraitUrl}
                  alt="Événements Maelle Mars"
                  className="w-full rounded-lg shadow-2xl relative z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Options Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-script text-4xl text-accent mb-4">
            Choisissez votre type d'événement
          </h2>
          <p className="text-foreground text-lg">
            Découvrez les conférences et salons auxquels je participe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Conference Card */}
          <Card className="bg-card border-accent/20 hover:border-accent/50 transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Mic2 className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <CardTitle className="text-2xl text-accent">Conférences</CardTitle>
              <CardDescription className="text-foreground/70">
                Présentations et interventions spirituelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                Assistez à mes conférences sur la voyance, la spiritualité et le développement personnel. Des moments d'échange et de partage dans une ambiance bienveillante.
              </p>
              <Button
                onClick={() => navigate('/events/conference')}
                className="w-full bg-accent hover:bg-accent/90 text-background"
              >
                Voir les conférences
              </Button>
            </CardContent>
          </Card>

          {/* Salon Card */}
          <Card className="bg-card border-accent/20 hover:border-accent/50 transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
              </div>
              <CardTitle className="text-2xl text-accent">Salons</CardTitle>
              <CardDescription className="text-foreground/70">
                Rencontres et bien-être collectif
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                Retrouvez-moi aux salons du bien-être et événements spirituels. Consultations, échanges et découvertes dans une atmosphère conviviale et inspirante.
              </p>
              <Button
                onClick={() => navigate('/events/salon')}
                className="w-full bg-accent hover:bg-accent/90 text-background"
              >
                Voir les salons
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
