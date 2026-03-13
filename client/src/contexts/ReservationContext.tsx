import React, { createContext, useContext, useState } from 'react';

export interface ReservationData {
  consultationType?: '10min' | '15min' | '25min' | '30min' | '40min' | '1hour';
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  wantUpdates?: boolean;
  acceptPrivacy?: boolean;
  selectedTime?: string;
  selectedDate?: string;
  selectedSlot?: { startTime: string; endTime: string };
}

interface ReservationContextType {
  reservation: ReservationData;
  updateReservation: (data: Partial<ReservationData>) => void;
  resetReservation: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [reservation, setReservation] = useState<ReservationData>({});

  const updateReservation = (data: Partial<ReservationData>) => {
    setReservation((prev) => ({ ...prev, ...data }));
  };

  const resetReservation = () => {
    setReservation({});
  };

  return (
    <ReservationContext.Provider value={{ reservation, updateReservation, resetReservation }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within ReservationProvider');
  }
  return context;
}

export function useReservationContext() {
  return useReservation();
}
