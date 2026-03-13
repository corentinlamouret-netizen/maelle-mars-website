import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';

export default function Conference() {
  const [, navigate] = useLocation();

  const conferences = [
    {
      id: 1,
      title: "Conférence Contact Défunt",
      date: "20 Avril 2026",
      time: "19H30 - 22H",
      location: "Toulouges, Salle Paroissiale",
      description: "Rejoignez-moi en salle pour une connexion profonde aux âmes, recevez leurs messages et vivez un moment unique de partage et d'amour. Un temps de voyance en direct viendra enrichir cette expérience spirituelle.",
      price: "15€",
      bookingUrl: "https://www.helloasso.com/associations/amphorea/evenements/conferences-contacts-defunts",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/events')}
            className="mb-6 text-accent hover:text-accent/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux événements
          </Button>

          <div className="space-y-4">
            <h1 className="text-script text-5xl md:text-6xl text-accent">
              Conférences
            </h1>
            <p className="text-xl text-foreground/80">
              Découvrez mes conférences et interventions spirituelles à travers la France
            </p>
          </div>
        </div>

        {/* Conferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {conferences.map((conference) => (
            <Card
              key={conference.id}
              className="bg-card border-accent/20 hover:border-accent/50 transition-all duration-300 overflow-hidden group"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-accent group-hover:text-accent/80 transition-colors">
                  {conference.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-foreground">
                    <Calendar className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-semibold">{conference.date}</p>
                      <p className="text-sm text-foreground/70">{conference.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-foreground">
                    <MapPin className="w-5 h-5 text-accent" />
                    <p>{conference.location}</p>
                  </div>

                </div>
                {/* Description */}
                <p className="text-foreground/80 leading-relaxed">
                  {conference.description}
                </p>

                {/* Price and Button */}
                <div className="flex items-center justify-between pt-4 border-t border-accent/10">
                  <span className="text-2xl font-semibold text-accent">
                    {conference.price}
                  </span>
                  <Button
                    onClick={() => window.open(conference.bookingUrl, '_blank')}
                    className="bg-accent hover:bg-accent/90 text-background"
                  >
                    Réserver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-card border border-accent/20 rounded-lg p-8 text-center">
          <h2 className="text-script text-3xl text-accent mb-4">
            Vous ne trouvez pas votre date ?
          </h2>
          <p className="text-foreground/80 mb-6">
            Contactez-moi pour connaître les prochaines conférences ou organiser un événement privé.
          </p>
          <Button
            onClick={() => navigate('/contact')}
            className="bg-accent hover:bg-accent/90 text-background"
          >
            Me Contacter
          </Button>
        </div>
      </div>
    </div>
  );
}
