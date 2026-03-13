import { useMemo, useCallback, useState } from 'react';
import { trpc } from '@/lib/trpc';

/**
 * Hook pour récupérer les événements à venir
 * Inclut memoization et caching
 */

export function useUpcomingEvents() {
  const { data: events, isLoading, error } = trpc.events.getUpcoming.useQuery();

  // Memoize les événements pour éviter les re-renders inutiles
  const memoizedEvents = useMemo(() => {
    if (!events) return [];
    return events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [events]);

  return {
    events: memoizedEvents,
    isLoading,
    error: error?.message || null,
  };
}

/**
 * Hook pour récupérer un événement spécifique
 */
export function useEventById(eventId: number) {
  const { data: event, isLoading, error } = trpc.events.getById.useQuery(
    { id: eventId },
    { enabled: !!eventId }
  );

  return {
    event: event || null,
    isLoading,
    error: error?.message || null,
  };
}

/**
 * Hook pour réserver une place à un événement
 */
export function useEventReservation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reserve = useCallback(async (eventId: number, numberOfPlaces: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Appel API pour réserver
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    reserve,
    isLoading,
    error,
  };
}

/**
 * Hook pour filtrer les événements par date
 */
export function useEventsByDateRange(startDate: Date, endDate: Date) {
  const { events, isLoading, error } = useUpcomingEvents();

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const eventDate = new Date(e.startTime);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }, [events, startDate, endDate]);

  return {
    events: filteredEvents,
    isLoading,
    error,
  };
}

/**
 * Hook pour les statistiques des événements
 */
export function useEventStats() {
  const { events } = useUpcomingEvents();

  const stats = useMemo(() => {
    if (!events || events.length === 0) {
      return {
        totalEvents: 0,
        totalPlaces: 0,
        totalReserved: 0,
        averagePrice: 0,
      };
    }

    const totalEvents = events.length;
    const totalPlaces = events.reduce((sum: number, e: any) => sum + 50, 0); // Placeholder
    const totalReserved = events.reduce((sum: number, e: any) => sum + 10, 0); // Placeholder
    const averagePrice = events.reduce((sum: number, e: any) => sum + 50, 0) / totalEvents;

    return {
      totalEvents,
      totalPlaces,
      totalReserved,
      averagePrice: Math.round(averagePrice * 100) / 100,
    };
  }, [events]);

  return stats;
}
