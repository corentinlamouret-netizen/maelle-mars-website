import { useLocation } from 'wouter';
import { useReservation } from '@/contexts/ReservationContext';

export default function BookingSelectType() {
  const [, navigate] = useLocation();
  const { updateReservation } = useReservation();

  const heroBackgroundUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp';

  const consultationTypes = [
    {
      id: '25min',
      icon: '✨',
      title: 'Consultation de 20 minutes',
      price: '70 €',
      duration: '20 minutes',
      description: 'Une consultation rapide et efficace pour vos questions.',
    },
    {
      id: '30min',
      icon: '💬',
      title: 'Consultation de 30 minutes',
      price: '90 €',
      duration: '30 minutes',
      description: 'Un échange complet pour approfondir votre consultation.',
    },
    {
      id: '40min',
      icon: '🌟',
      title: 'Consultation de 45 minutes',
      price: '110 €',
      duration: '45 minutes',
      description: 'Une séance enrichie pour des réponses plus détaillées.',
    },
    {
      id: '1hour',
      icon: '🔮',
      title: 'Consultation d\'1 heure',
      price: '130 €',
      duration: '1 heure',
      description: 'Une séance approfondie pour recevoir des réponses complètes.',
    },
  ];

  const handleSelectType = (typeId: string) => {
    updateReservation({ consultationType: typeId as any });
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
            Réserver une consultation
          </h1>
          <h2 className="text-2xl text-foreground font-light mb-6">
            Choisissez le type de consultation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sélectionnez le service qui correspond à vos besoins
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {consultationTypes.map((consultation, index) => (
            <div
              key={consultation.id}
              className="bg-card/80 backdrop-blur-sm rounded-lg p-8 border border-accent/20 hover:border-accent/50 transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleSelectType(consultation.id)}
            >
              {/* Icône */}
              <div className="text-5xl mb-4">{consultation.icon}</div>

              {/* Titre */}
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {consultation.title}
              </h3>

              {/* Prix */}
              <div className="mb-4">
                <p className="text-3xl font-bold text-accent">
                  {consultation.price}
                </p>
                <p className="text-sm text-muted-foreground">
                  {consultation.duration}
                </p>
              </div>

              {/* Description */}
              <p className="text-foreground mb-6">
                {consultation.description}
              </p>

              {/* Bouton */}
              <button className="btn-golden w-full">
                Choisir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
