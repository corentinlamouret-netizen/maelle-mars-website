import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, X, Bell, Filter } from "lucide-react";

interface ReservationInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consultationType: string;
  startTime: string;
  endTime: string;
}

interface BlockedDateInfo {
  id: number;
  startTime: string;
  endTime: string;
  reason?: string;
}

export default function AdminCalendar() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateDetails, setSelectedDateDetails] = useState<{
    date: string;
    reservations: ReservationInfo[];
    blockedSlots: BlockedDateInfo[];
  } | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string | null>(null);
  const [nextAppointment, setNextAppointment] = useState<ReservationInfo | null>(null);

  const filteredReservations = useMemo(() => {
    return [].filter((r: any) => {
      if (filterType && r.consultationType !== filterType) return false;
      if (filterPaymentStatus && r.paymentStatus !== filterPaymentStatus) return false;
      return true;
    });
  }, [filterType, filterPaymentStatus]);

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation]);

  // Get all reservations for the month
  const allReservationsQuery = trpc.admin.getAllReservations.useQuery();

  const blockDateMutation = trpc.admin.blockTimeSlot.useMutation({
    onSuccess: () => {
      setShowBlockModal(false);
      setBlockDate("");
      setBlockReason("");
      // Refetch data
      allReservationsQuery.refetch();
    },
  });

  const unblockDateMutation = trpc.admin.unblockTimeSlot.useMutation({
    onSuccess: () => {
      allReservationsQuery.refetch();
    },
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return <div className="text-center py-10 text-foreground">Accès non autorisé</div>;
  }

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Format date as YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  // Get reservations for a specific date
  const getReservationsForDate = (dateStr: string): ReservationInfo[] => {
    return (allReservationsQuery.data || []).filter(
      (r: any) => r.reservationDate === dateStr
    );
  };

  // Handle date click
  const handleDateClick = async (dateStr: string) => {
    const reservations = getReservationsForDate(dateStr);
    setSelectedDateDetails({
      date: dateStr,
      reservations,
      blockedSlots: [],
    });
  };

  // Handle block date
  const handleBlockDate = () => {
    if (!blockDate) return;

    blockDateMutation.mutate({
      date: blockDate,
      startTime: "00:00",
      endTime: "23:59",
      reason: blockReason || "Indisponibilité",
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Next Appointment Alert */}
        {nextAppointment && (
          <div className="bg-accent/20 border-l-4 border-accent p-4 mb-8 rounded">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-accent mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">Prochain Rendez-vous</h3>
                <p className="text-foreground/70">
                  {nextAppointment.firstName} {nextAppointment.lastName} - {nextAppointment.consultationType}
                </p>
                <p className="text-sm text-foreground/60">{nextAppointment.phone}</p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-4xl font-bold text-foreground mb-8">Agenda des Réservations</h1>

        {/* Filters */}
        <div className="bg-card border border-accent/20 p-4 rounded-lg mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-foreground">Filtrer les réservations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Type de consultation</label>
              <select
                value={filterType || ""}
                onChange={(e) => setFilterType(e.target.value || null)}
                className="w-full px-3 py-2 rounded bg-background border border-accent/20 text-foreground"
              >
                <option value="">Tous les types</option>
                <option value="25min">25 minutes</option>
                <option value="30min">30 minutes</option>
                <option value="40min">40 minutes</option>
                <option value="1hour">1 heure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Statut de paiement</label>
              <select
                value={filterPaymentStatus || ""}
                onChange={(e) => setFilterPaymentStatus(e.target.value || null)}
                className="w-full px-3 py-2 rounded bg-background border border-accent/20 text-foreground"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="completed">Complété</option>
                <option value="failed">Échoué</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Résultats</label>
              <div className="px-3 py-2 rounded bg-background border border-accent/20 text-foreground">
                {filteredReservations.length} réservation(s)
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
            }
            className="bg-accent hover:bg-amber-600 text-background"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-foreground capitalize">{monthName}</h2>
          <Button
            onClick={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
            }
            className="bg-accent hover:bg-amber-600 text-background"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {/* Day headers */}
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div key={day} className="text-center text-amber-100 font-bold p-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="bg-slate-700/30 rounded-lg p-4 h-24" />;
            }

            const dateStr = formatDate(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );
            const reservations = getReservationsForDate(dateStr);
            const hasReservations = reservations.length > 0;

            return (
              <button
                key={day}
                onClick={() => handleDateClick(dateStr)}
                className={`rounded-lg p-4 h-24 transition-all border-2 ${
                  hasReservations
                    ? "bg-blue-700/40 border-blue-500 hover:bg-blue-600/40"
                    : "bg-slate-700 border-slate-600 hover:border-amber-500"
                }`}
              >
                <div className="text-foreground font-bold text-lg mb-1">{day}</div>
                {hasReservations && (
                  <div className="text-xs text-blue-200">
                    {reservations.length} réservation{reservations.length > 1 ? "s" : ""}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Block Date Button */}
        <div className="mb-8">
          <Button
            onClick={() => setShowBlockModal(true)}
            className="bg-red-600 hover:bg-red-700 text-foreground"
          >
            Bloquer une date
          </Button>
        </div>

        {/* Block Date Modal */}
        {showBlockModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-slate-800 border-slate-600 p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">Bloquer une date</h3>
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="text-gray-400 hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-foreground mb-2">Date:</label>
                  <input
                    type="date"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-slate-700 text-foreground border border-slate-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2">Raison (optionnel):</label>
                  <input
                    type="text"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="Ex: Congés, Événement personnel..."
                    className="w-full px-4 py-2 rounded bg-slate-700 text-foreground border border-slate-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowBlockModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleBlockDate}
                    disabled={!blockDate}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-foreground"
                  >
                    Bloquer
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Selected Date Details */}
        {selectedDateDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-slate-800 border-slate-600 p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">
                  Réservations du {selectedDateDetails.date}
                </h3>
                <button
                  onClick={() => setSelectedDateDetails(null)}
                  className="text-gray-400 hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedDateDetails.reservations.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateDetails.reservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-slate-700 p-4 rounded border border-slate-600"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-foreground">
                            {res.firstName} {res.lastName}
                          </p>
                          <p className="text-sm text-gray-300">{res.email}</p>
                          <p className="text-sm text-gray-300">{res.phone}</p>
                          <p className="text-sm text-amber-200 mt-2">
                            {res.startTime} - {res.endTime}
                          </p>
                          <p className="text-sm text-gray-400">
                            Type:{" "}
                            {res.consultationType === "question"
                              ? "Question oui/non"
                              : res.consultationType === "30min"
                                ? "30 minutes"
                                : "1 heure"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">Aucune réservation pour cette date</p>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
