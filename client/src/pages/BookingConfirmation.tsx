import { useLocation } from 'wouter';
import { useReservation } from '@/contexts/ReservationContext';

export default function BookingConfirmation() {
  const [, navigate] = useLocation();
  const { reservation, resetReservation } = useReservation();

  const heroBackgroundUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp';

  const getConsultationTypeLabel = () => {
    switch (reservation.consultationType) {
      case '25min':
        return 'Consultation de 25 minutes';
      case '30min':
        return 'Consultation de 30 minutes';
      case '40min':
        return 'Consultation de 40 minutes';
      case '1hour':
        return 'Consultation d\'1 heure';
      default:
        return '';
    }
  };

  const getConsultationTypePrice = () => {
    switch (reservation.consultationType) {
      case '25min':
        return '70 €';
      case '30min':
        return '80 €';
      case '40min':
        return '110 €';
      case '1hour':
        return '150 €';
      default:
        return '';
    }
  };

  const handleNewReservation = () => {
    resetReservation();
    navigate('/booking');
  };

  const handleHome = () => {
    resetReservation();
    navigate('/');
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
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-script text-5xl md:text-6xl text-accent mb-4">
            Réservation confirmée
          </h1>
          <p className="text-lg text-muted-foreground">
            Merci pour votre confiance !
          </p>
        </div>

        {/* Récapitulatif */}
        <div className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm rounded-lg p-8 border border-accent/20 animate-fade-in-up space-y-6">
          {/* Titre récapitulatif */}
          <div className="text-center pb-6 border-b border-accent/20">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Récapitulatif de votre réservation
            </h2>
          </div>

          {/* Détails */}
          <div className="space-y-4">
            {/* Type de consultation */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type de consultation :</span>
              <span className="font-semibold text-foreground">{getConsultationTypeLabel()}</span>
            </div>

            {/* Prix */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tarif :</span>
              <span className="font-semibold text-accent text-lg">{getConsultationTypePrice()}</span>
            </div>

            {/* Horaire */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Créneau sélectionné :</span>
              <span className="font-semibold text-foreground">{reservation.selectedTime}</span>
            </div>

            {/* Divider */}
            <div className="divider-golden"></div>

            {/* Informations client */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Vos informations</h3>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nom :</span>
                <span className="text-foreground">{reservation.firstName} {reservation.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Téléphone :</span>
                <span className="text-foreground">{reservation.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adresse :</span>
                <span className="text-foreground text-right">{reservation.address}</span>
              </div>
            </div>
          </div>

          {/* Mention importante */}
          <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-accent">*Important :</span> Veuillez appeler Maelle Mars au <a href="tel:+33646226610" className="text-accent font-semibold hover:underline">06 46 22 66 10</a> pour confirmer votre réservation à l'horaire sélectionné.
            </p>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={handleHome}
              className="flex-1 px-6 py-3 rounded-lg border border-accent/50 text-accent hover:bg-accent/10 transition-all duration-300 font-medium"
            >
              Retour à l'accueil
            </button>
            <button
              onClick={handleNewReservation}
              className="flex-1 btn-golden py-3 font-semibold"
            >
              Nouvelle réservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
