import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useReservationContext } from '@/contexts/ReservationContext';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const { reservation } = useReservationContext();
  const [isCreating, setIsCreating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createReservationMutation = trpc.reservations.createV2.useMutation();

  useEffect(() => {
    const createReservation = async () => {
      try {
        if (!reservation.firstName || !reservation.consultationType || !reservation.selectedDate || !reservation.selectedTime) {
          throw new Error('Données de réservation incomplètes');
        }

        // Create reservation with payment info
        await createReservationMutation.mutateAsync({
          firstName: reservation.firstName || '',
          lastName: reservation.lastName || '',
          email: reservation.email || '',
          phone: reservation.phone || '',
          address: reservation.address || '',
          consultationType: reservation.consultationType as '25min' | '30min' | '40min' | '1hour',
          reservationDate: reservation.selectedDate || '',
          startTime: reservation.selectedTime || '',
          endTime: reservation.selectedTime || '',
          wantsUpdates: reservation.wantUpdates || false,
          acceptedTerms: reservation.acceptPrivacy || false,
        });

        setIsCreating(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la création de la réservation');
        setIsCreating(false);
      }
    };

    createReservation();
  }, []);

  const getConsultationLabel = () => {
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

  const getPrice = () => {
    switch (reservation.consultationType) {
      case '25min':
        return 70;
      case '30min':
        return 80;
      case '40min':
        return 110;
      case '1hour':
        return 150;
      default:
        return 0;
    }
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Création de votre réservation...</h1>
          <p className="text-gray-300 mt-2">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-red-900/20 border-red-600 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Erreur</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <Button onClick={() => navigate('/booking')} className="bg-amber-600 hover:bg-amber-700">
              Recommencer
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Paiement Réussi!</h1>
          <p className="text-gray-300">Votre réservation a été confirmée</p>
        </div>

        {/* Confirmation Details */}
        <Card className="bg-slate-700 border-slate-600 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Détails de votre réservation</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Nom:</span>
              <span className="text-white font-semibold">{reservation.firstName} {reservation.lastName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Email:</span>
              <span className="text-white font-semibold">{reservation.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Téléphone:</span>
              <span className="text-white font-semibold">{reservation.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Type de consultation:</span>
              <span className="text-white font-semibold">{getConsultationLabel()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Date:</span>
              <span className="text-white font-semibold">{reservation.selectedDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Horaire:</span>
              <span className="text-white font-semibold">{reservation.selectedTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Montant payé:</span>
              <span className="text-white font-semibold text-lg text-amber-400">{getPrice()}€</span>
            </div>
          </div>

          <div className="border-t border-slate-600 pt-4 mt-6">
            <p className="text-gray-300 mb-4">
              <strong>⚠️ Important:</strong> C'est à vous d'appeler Maelle Mars au <strong>06 46 22 66 10</strong> à la date et l'heure convenues pour votre consultation.
            </p>
            <p className="text-gray-400 text-sm">
              Un email de confirmation a été envoyé à {reservation.email} avec tous les détails de votre réservation.
            </p>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="bg-slate-700 border-slate-600 p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Prochaines étapes</h3>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold">1.</span>
              <span>Vous recevrez un email de confirmation avec les détails</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold">2.</span>
              <span>Appelez Maelle au <strong>06 46 22 66 10</strong> à la date et l'heure de votre réservation</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 font-bold">3.</span>
              <span>Profitez de votre consultation spirituelle</span>
            </li>
          </ol>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/')} className="bg-amber-600 hover:bg-amber-700 px-8">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
