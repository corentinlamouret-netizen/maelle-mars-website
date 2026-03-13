import { useLocation } from 'wouter';
import { useReservation } from '@/contexts/ReservationContext';

export default function Consultations() {
  const [, navigate] = useLocation();
  const { updateReservation } = useReservation();
  const heroBackgroundUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp';

  const consultations = [
    {
      icon: '⚡',
      title: 'Consultation express',
      price: '15 €',
      duration: '10 minutes',
      consultationType: '10min' as const,
      description: 'Une réponse rapide et directe à votre question urgente.',
      popular: false,
      color: 'from-yellow-500/20 to-yellow-600/20',
      borderColor: 'border-yellow-400/30',
    },
    {
      icon: '💬',
      title: 'Consultation rapide',
      price: '70 €',
      duration: '20 minutes',
      consultationType: '25min' as const,
      description: 'Une réponse rapide et précise à votre question.',
      popular: false,
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-400/30',
    },
    {
      icon: '✨',
      title: 'Consultation standard',
      price: '90 €',
      duration: '30 minutes',
      consultationType: '30min' as const,
      description: 'Un échange complet pour répondre à votre question.',
      popular: true,
      color: 'from-accent/30 to-accent/20',
      borderColor: 'border-accent/50',
    },
    {
      icon: '🔮',
      title: 'Consultation approfondie',
      price: '110 €',
      duration: '45 minutes',
      consultationType: '40min' as const,
      description: 'Une séance approfondie pour recevoir des réponses claires et une guidance spirituelle.',
      popular: false,
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-400/30',
    },
    {
      icon: '👑',
      title: 'Consultation premium',
      price: '130 €',
      duration: '1 heure',
      consultationType: '1hour' as const,
      description: 'Une séance complète et détaillée pour une guidance spirituelle profonde et personnalisée.',
      popular: false,
      color: 'from-amber-500/20 to-amber-600/20',
      borderColor: 'border-amber-400/30',
    },
  ];

  const handleBook = (consultationType: '10min' | '25min' | '30min' | '40min' | '1hour') => {
    updateReservation({ consultationType });
    navigate('/booking/form');
  };

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
        {/* Titre */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-script text-5xl md:text-6xl text-accent mb-4">
            Consultations spirituelles
          </h1>
          <h2 className="text-3xl text-foreground font-light mb-6">
            avec Maelle Mars
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recevez des réponses claires, des messages de l'au-delà et une guidance sincère pour avancer plus sereinement sur votre chemin de vie.
          </p>
        </div>

        {/* Horizontal Layout - Consultations */}
        <div className="max-w-5xl mx-auto space-y-6 mb-12">
          {consultations.map((consultation, index) => (
            <div
              key={index}
              className={`relative animate-fade-in-up flex items-stretch gap-6 group`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Icon Circle */}
              <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-card border-2 border-accent flex items-center justify-center text-4xl shadow-lg">
                  {consultation.icon}
                </div>
              </div>

              {/* Card content */}
              <div className={`flex-1 bg-gradient-to-br ${consultation.color} backdrop-blur-sm rounded-2xl p-6 border ${consultation.borderColor} transition-all duration-300 hover:shadow-2xl flex flex-col justify-between`}>
                <div className="relative">
                  {/* Popular badge */}
                  {consultation.popular && (
                    <div className="absolute -top-3 -right-3 bg-accent text-card px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      ⭐ RECOMMANDÉE
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-light text-foreground mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {consultation.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{consultation.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-3xl font-bold text-accent">{consultation.price}</p>
                      <p className="text-xs text-muted-foreground mt-1">{consultation.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={() => handleBook(consultation.consultationType)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 block text-center ${
                    consultation.popular
                      ? 'bg-accent text-card hover:bg-accent/90 shadow-lg'
                      : 'border border-accent/50 text-accent hover:bg-accent/10'
                  }`}
                >
                  Réserver maintenant
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Test Consultation Section */}


        {/* Section CTA */}
        <div className="text-center space-y-6 mt-12">
          <h3 className="text-3xl font-bold text-foreground">
            Besoin de conseils pour choisir ?
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chaque consultation est adaptée à vos besoins. Contactez-moi si vous avez des questions.
          </p>
          <button className="btn-golden text-lg px-10 py-4 animate-glow-pulse">
            Me contacter
          </button>
        </div>
      </div>
    </div>
  );
}
