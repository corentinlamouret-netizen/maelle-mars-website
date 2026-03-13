import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useReservation } from '@/contexts/ReservationContext';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function BookingSchedule() {
  const [, navigate] = useLocation();
  const { reservation, updateReservation } = useReservation();
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Guard: if consultationType is missing, redirect back to booking form
  useEffect(() => {
    if (!reservation.consultationType) {
      toast.error('Veuillez d\'abord choisir un type de consultation');
      navigate('/booking/form');
    }
  }, [reservation.consultationType, navigate]);

  const createReservationMutation = trpc.reservations.createV2.useMutation();
  
  // Get available slots for the selected date and consultation type
  // Only run the query when consultationType is defined and valid
  const validConsultationType = reservation.consultationType as '10min' | '15min' | '25min' | '30min' | '40min' | '1hour' | undefined;
  const availableSlotsQuery = trpc.reservations.getAvailableSlots.useQuery(
    {
      date: selectedDate,
      consultationType: validConsultationType ?? '30min',
    },
    {
      enabled: !!validConsultationType,
    }
  );

  const heroBackgroundUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp';

  const getConsultationTypeLabel = () => {
    switch (reservation.consultationType) {
      case '10min':
        return 'Consultation de 10 minutes';
      case '15min':
        return 'Consultation de 15 minutes';
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

  const handleConfirm = () => {
    if (!selectedSlot) {
      toast.error('Veuillez sélectionner un créneau horaire');
      return;
    }

    // Update reservation context with selected date and time
    updateReservation({ 
      selectedTime: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
      selectedDate,
      selectedSlot,
    });

    // Redirect to payment page
    navigate('/booking/payment');
  };

  const handleGoBack = () => {
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

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-cursive text-center text-amber-100 mb-4">
          Sélectionnez un créneau
        </h1>
        <p className="text-center text-white mb-8">
          {getConsultationTypeLabel()}
        </p>

        {/* Date Selector */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-amber-500/30">
          <label className="block text-white mb-3 font-semibold">Sélectionner une date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null); // Reset selected slot when date changes
            }}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Available Slots */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-amber-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">Créneaux disponibles</h2>
          
          {availableSlotsQuery.isLoading ? (
            <p className="text-white">Chargement des créneaux disponibles...</p>
          ) : availableSlotsQuery.data && availableSlotsQuery.data.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableSlotsQuery.data.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime
                      ? 'bg-amber-500 text-black border-2 border-amber-400'
                      : 'bg-slate-700 text-white border-2 border-slate-600 hover:border-amber-500'
                  }`}
                >
                  {slot.startTime}
                  <br />
                  <span className="text-sm">{slot.endTime}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-white text-center">
              Aucun créneau disponible pour cette date. Veuillez sélectionner une autre date.
            </p>
          )}
        </div>

        {/* Important Notice */}
        <div className="bg-amber-900/40 border border-amber-500/50 rounded-lg p-4 mb-8">
          <p className="text-amber-100 text-sm">
            *Attention: C'est à vous d'appeler la prestataire de service pour confirmer votre réservation au numéro fourni.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="px-8 py-3 rounded-full bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-all border border-slate-600"
          >
            Retour
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSlot}
            className={`px-8 py-3 rounded-full font-semibold transition-all border ${
              selectedSlot
                ? 'bg-amber-500 text-black hover:bg-amber-600 border-amber-400'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed border-gray-600'
            }`}
          >
            Continuer vers le paiement
          </button>
        </div>
      </div>
    </div>
  );
}
