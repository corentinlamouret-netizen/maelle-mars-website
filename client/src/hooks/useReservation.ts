import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';

/**
 * Hook réutilisable pour la gestion des réservations
 * Centralise la logique de soumission et d'état
 */

export interface ReservationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  consultationType: '25min' | '30min' | '40min' | '1hour';
  selectedTime: string;
  wantsUpdates: boolean;
  acceptedTerms: boolean;
}

export interface UseReservationState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  reservationId: number | null;
}

export function useReservation() {
  const [state, setState] = useState<UseReservationState>({
    isLoading: false,
    error: null,
    success: false,
    reservationId: null,
  });

  const createReservationMutation = trpc.reservations.create.useMutation();

  const submitReservation = useCallback(async (data: ReservationData) => {
    setState({ isLoading: true, error: null, success: false, reservationId: null });

    try {
      const result = await createReservationMutation.mutateAsync(data);
      setState({
        isLoading: false,
        error: null,
        success: true,
        reservationId: result.reservationId || null,
      });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setState({
        isLoading: false,
        error: errorMessage,
        success: false,
        reservationId: null,
      });
      throw error;
    }
  }, [createReservationMutation]);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, success: false, reservationId: null });
  }, []);

  return {
    ...state,
    submitReservation,
    reset,
  };
}

/**
 * Hook pour récupérer les réservations de l'utilisateur
 */
export function useUserReservations(email: string) {
  const { data: reservations, isLoading, error } = trpc.admin.searchByEmail.useQuery(
    { email },
    { enabled: !!email }
  );

  return {
    reservations: reservations || [],
    isLoading,
    error: error?.message || null,
  };
}

/**
 * Hook pour annuler une réservation
 */
export function useCancelReservation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelMutation = trpc.admin.cancelReservation.useMutation();

  const cancel = useCallback(async (reservationId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await cancelMutation.mutateAsync({ id: reservationId });
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'annulation';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, [cancelMutation]);

  return {
    isLoading,
    error,
    cancel,
  };
}
