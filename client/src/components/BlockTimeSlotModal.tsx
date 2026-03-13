import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Lock, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface BlockTimeSlotModalProps {
  date: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BlockTimeSlotModal({ date, isOpen, onClose, onSuccess }: BlockTimeSlotModalProps) {
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('13:00');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blockTimeSlot = trpc.admin.blockTimeSlot.useMutation();

  const validateTimes = (): boolean => {
    // Vérifier que les heures sont au format HH:MM
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(startTime)) {
      setError('Heure de début invalide (format: HH:MM)');
      return false;
    }
    if (!timeRegex.test(endTime)) {
      setError('Heure de fin invalide (format: HH:MM)');
      return false;
    }

    // Vérifier que l'heure de fin est après l'heure de début
    if (startTime >= endTime) {
      setError('L\'heure de fin doit être après l\'heure de début');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Valider les heures
    if (!validateTimes()) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending block request:', { date, startTime, endTime, reason });
      
      await blockTimeSlot.mutateAsync({
        date,
        startTime,
        endTime,
        reason: reason || undefined,
      });

      // Reset form
      setStartTime('12:00');
      setEndTime('13:00');
      setReason('');
      setError(null);
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error blocking time slot:', error);
      const errorMessage = error?.message || 'Erreur lors du blocage du créneau';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-accent/30 p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-accent flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Bloquer un créneau
          </h2>
          <button
            onClick={onClose}
            className="text-foreground/50 hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50/20 border border-red-500/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Display */}
          <div>
            <label className="text-sm font-medium text-foreground/70">Date</label>
            <p className="text-lg font-semibold text-accent mt-1">
              {new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="startTime" className="text-sm font-medium text-foreground/70">
              Heure de début
            </label>
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setError(null);
              }}
              className="w-full mt-1 px-3 py-2 bg-background border border-accent/30 rounded-lg text-foreground focus:outline-none focus:border-accent"
              disabled={isLoading}
            />
          </div>

          {/* End Time */}
          <div>
            <label htmlFor="endTime" className="text-sm font-medium text-foreground/70">
              Heure de fin
            </label>
            <input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setError(null);
              }}
              className="w-full mt-1 px-3 py-2 bg-background border border-accent/30 rounded-lg text-foreground focus:outline-none focus:border-accent"
              disabled={isLoading}
            />
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="text-sm font-medium text-foreground/70">
              Raison (optionnel)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError(null);
              }}
              placeholder="Ex: Pause, Rendez-vous personnel, etc."
              className="w-full mt-1 px-3 py-2 bg-background border border-accent/30 rounded-lg text-foreground focus:outline-none focus:border-accent resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent/90 text-background"
              disabled={isLoading}
            >
              {isLoading ? 'Blocage...' : 'Bloquer le créneau'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
