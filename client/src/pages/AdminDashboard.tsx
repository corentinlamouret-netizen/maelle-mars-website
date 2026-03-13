import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [view, setView] = useState<"calendar" | "block">("calendar");

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation]);

  const reservationsQuery = trpc.admin.getReservationsByDate.useQuery({
    date: selectedDate,
  });

  const blockedSlotsQuery = trpc.admin.getBlockedSlots.useQuery({
    date: selectedDate,
  });

  const blockTimeSlotMutation = trpc.admin.blockTimeSlot.useMutation({
    onSuccess: () => {
      blockedSlotsQuery.refetch();
    },
  });

  const unblockTimeSlotMutation = trpc.admin.unblockTimeSlot.useMutation({
    onSuccess: () => {
      blockedSlotsQuery.refetch();
    },
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return <div className="text-center py-10">Accès non autorisé</div>;
  }

  const handleBlockSlot = (startTime: string, endTime: string) => {
    const reason = prompt("Raison du blocage (optionnel):");
    blockTimeSlotMutation.mutate({
      date: selectedDate,
      startTime,
      endTime,
      reason: reason || undefined,
    });
  };

  const handleUnblockSlot = (id: number) => {
    unblockTimeSlotMutation.mutate({ id });
  };

  // Generate all time slots for the day
  const allTimeSlots = [];
  for (let hour = 9; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      const endTime = `${String(hour).padStart(2, "0")}:${String((minute + 30) % 60).padStart(2, "0")}`;
      allTimeSlots.push({ startTime, endTime });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Tableau de Bord Administrateur</h1>

        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setView("calendar")}
            variant={view === "calendar" ? "default" : "outline"}
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            Réservations
          </Button>
          <Button
            onClick={() => setView("block")}
            variant={view === "block" ? "default" : "outline"}
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            Bloquer des créneaux
          </Button>
        </div>

        {/* Date Selector */}
        <div className="mb-8">
          <label className="block text-white mb-2">Sélectionner une date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded bg-slate-700 text-white border border-slate-600"
          />
        </div>

        {/* Calendar View */}
        {view === "calendar" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Réservations du {selectedDate}</h2>

            {reservationsQuery.isLoading ? (
              <p className="text-white">Chargement...</p>
            ) : reservationsQuery.data && reservationsQuery.data.length > 0 ? (
              <div className="grid gap-4">
                {reservationsQuery.data.map((reservation) => (
                  <Card
                    key={reservation.id}
                    className="bg-slate-700 border-slate-600 p-6 text-white"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-lg">
                          {reservation.firstName} {reservation.lastName}
                        </p>
                        <p className="text-sm text-gray-300">{reservation.email}</p>
                        <p className="text-sm text-gray-300">{reservation.phone}</p>
                      </div>
                      <div>
                        <p className="font-bold">
                          {reservation.startTime} - {reservation.endTime}
                        </p>
                        <p className="text-sm text-gray-300">
                          Type: {reservation.consultationType === "25min" ? "25 minutes" : reservation.consultationType === "30min" ? "30 minutes" : reservation.consultationType === "40min" ? "40 minutes" : "1 heure"}
                        </p>
                        <p className="text-sm text-gray-300">Adresse: {reservation.address}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-white">Aucune réservation pour cette date</p>
            )}
          </div>
        )}

        {/* Block Time Slots View */}
        {view === "block" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Gérer les créneaux du {selectedDate}</h2>

            {/* Blocked Slots */}
            {blockedSlotsQuery.data && blockedSlotsQuery.data.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Créneaux bloqués</h3>
                <div className="grid gap-2">
                  {blockedSlotsQuery.data.map((slot) => (
                    <div
                      key={slot.id}
                      className="bg-red-700 p-4 rounded flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {slot.startTime} - {slot.endTime}
                        </p>
                        {slot.reason && <p className="text-sm text-gray-200">{slot.reason}</p>}
                      </div>
                      <Button
                        onClick={() => handleUnblockSlot(slot.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Débloquer
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Slots to Block */}
            <h3 className="text-xl font-bold text-white mb-4">Créneaux disponibles</h3>
            <div className="grid grid-cols-4 gap-2">
              {allTimeSlots.map((slot, index) => {
                const isBlocked = blockedSlotsQuery.data?.some(
                  (b) => b.startTime === slot.startTime && b.endTime === slot.endTime
                );
                const hasReservation = reservationsQuery.data?.some(
                  (r) => r.startTime === slot.startTime && r.endTime === slot.endTime
                );

                return (
                  <Button
                    key={index}
                    onClick={() => handleBlockSlot(slot.startTime, slot.endTime)}
                    disabled={isBlocked || hasReservation}
                    className={`${
                      isBlocked
                        ? "bg-red-700 text-white"
                        : hasReservation
                          ? "bg-blue-700 text-white"
                          : "bg-slate-600 hover:bg-slate-500 text-white"
                    }`}
                  >
                    {slot.startTime}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
