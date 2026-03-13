import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Lock, Unlock } from "lucide-react";
import { BlockTimeSlotModal } from "@/components/BlockTimeSlotModal";
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";

type ViewMode = "day" | "week" | "month";

interface DayReservations {
  date: string;
  reservations: any[];
  visitCount: number;
}

export default function AdminCalendarAgenda() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);

  // Redirect if not admin
  if (!authLoading && user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  // Fetch reservations for the current month
  const { data: allReservations = [], isLoading: reservationsLoading } = trpc.admin.getAllReservations.useQuery(
    undefined,
    {
      enabled: user?.role === "admin" && !authLoading,
    }
  );

  // Fetch daily visitors for current month
  const { data: dailyVisitors = [] } = trpc.admin.getDailyVisitors.useQuery(
    {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
    },
    {
      enabled: user?.role === "admin" && !authLoading,
    }
  );

  // Fetch blocked slots for selected date
  const { data: selectedDateBlockedSlots = [], refetch: refetchBlockedSlots } = trpc.admin.getBlockedSlots.useQuery(
    { date: selectedDate || "" },
    {
      enabled: user?.role === "admin" && !authLoading && !!selectedDate,
    }
  );

  const unblockTimeSlot = trpc.admin.unblockTimeSlot.useMutation({
    onSuccess: () => refetchBlockedSlots(),
  });

  // Group reservations by date
  const reservationsByDate = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    allReservations.forEach((res) => {
      const date = res.reservationDate || "";
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(res);
    });
    return grouped;
  }, [allReservations]);

  // Calculate calendar days based on view mode
  const calendarDays = useMemo(() => {
    let days: Date[] = [];

    if (viewMode === "month") {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      days = eachDayOfInterval({ start, end });
      // Add padding days from previous/next month
      const startDay = startOfWeek(start, { weekStartsOn: 1 });
      const endDay = endOfWeek(end, { weekStartsOn: 1 });
      days = eachDayOfInterval({ start: startDay, end: endDay });
    } else if (viewMode === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      days = eachDayOfInterval({ start, end });
    } else {
      // day view
      days = [currentDate];
    }

    return days;
  }, [currentDate, viewMode]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalReservations = allReservations.length;
    const totalVisits = dailyVisitors.reduce((sum, dv) => sum + dv.visitCount, 0);
    const totalRevenue = allReservations.reduce((sum, r) => {
      if (r.consultationType === "25min") return sum + 25;
      if (r.consultationType === "30min") return sum + 70;
      if (r.consultationType === "40min") return sum + 90;
      if (r.consultationType === "1hour") return sum + 110;
      return sum;
    }, 0);

    return {
      totalReservations,
      totalVisits,
      totalRevenue,
      averageVisitsPerDay: dailyVisitors.length > 0 ? Math.round(totalVisits / dailyVisitors.length) : 0,
    };
  }, [allReservations, dailyVisitors]);

  // Get next appointment for selected date
  const selectedDateReservations = useMemo(() => {
    if (!selectedDate) return [];
    return (reservationsByDate[selectedDate] || []).sort((a, b) => {
      const timeA = a.startTime || "00:00";
      const timeB = b.startTime || "00:00";
      return timeA.localeCompare(timeB);
    });
  }, [selectedDate, reservationsByDate]);

  const handlePrevious = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const isLoading = reservationsLoading;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl text-accent font-light mb-2" style={{ fontFamily: "'Pinyon Script', cursive" }}>
            Agenda des Consultations
          </h1>
          <p className="text-foreground/70">
            Consultez vos réservations et statistiques de visites
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 p-6">
            <p className="text-sm text-foreground/70 mb-2">Réservations Total</p>
            <p className="text-3xl font-bold text-accent">{stats.totalReservations}</p>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30 p-6">
            <p className="text-sm text-foreground/70 mb-2">Visites Total</p>
            <p className="text-3xl font-bold text-blue-400">{stats.totalVisits}</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 p-6">
            <p className="text-sm text-foreground/70 mb-2">Moyenne Visites/Jour</p>
            <p className="text-3xl font-bold text-green-400">{stats.averageVisitsPerDay}</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30 p-6">
            <p className="text-sm text-foreground/70 mb-2">Revenus Total</p>
            <p className="text-3xl font-bold text-purple-400">{stats.totalRevenue}€</p>
          </Card>
        </div>

        {/* View Mode Selector & Navigation */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex gap-2">
            {(["day", "week", "month"] as const).map((mode) => (
              <Button
                key={mode}
                onClick={() => setViewMode(mode)}
                variant={viewMode === mode ? "default" : "outline"}
                className={viewMode === mode ? "bg-accent text-background" : ""}
              >
                {mode === "day" ? "Jour" : mode === "week" ? "Semaine" : "Mois"}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handlePrevious} variant="outline" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center min-w-[200px]">
              <p className="font-semibold text-accent" style={{ fontFamily: "'Pinyon Script', cursive", fontSize: "1.5rem" }}>
                {format(currentDate, "MMMM yyyy", { locale: fr })}
              </p>
            </div>
            <Button onClick={handleNext} variant="outline" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border-amber-700/30 p-8 shadow-lg" style={{ backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><defs><pattern id=\"paper\" x=\"0\" y=\"0\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><rect width=\"100\" height=\"100\" fill=\"%23D2B48C\"/><line x1=\"0\" y1=\"0\" x2=\"100\" y2=\"100\" stroke=\"%23A0826D\" stroke-width=\"0.5\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23paper)\"/></svg>')" }}>
                {viewMode === "month" && (
                  <div>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                        <div key={day} className="text-center font-bold text-amber-900" style={{ fontFamily: "'Crimson Text', serif" }}>
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-2">
                      {calendarDays.map((day, idx) => {
                        const dateStr = format(day, "yyyy-MM-dd");
                        const dayReservations = reservationsByDate[dateStr] || [];
                        const dayVisits = dailyVisitors.find((dv) => dv.date === dateStr)?.visitCount || 0;
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isSelected = selectedDate === dateStr;

                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`p-3 rounded-lg border-2 transition-all min-h-[100px] flex flex-col justify-between ${
                              isSelected
                                ? "border-accent bg-accent/20 shadow-lg"
                                : isCurrentMonth
                                ? "border-amber-700/30 bg-amber-50/30 hover:border-amber-700/50"
                                : "border-amber-700/10 bg-amber-50/10 opacity-50"
                            }`}
                          >
                            <div className="text-left">
                              <p className="font-bold text-amber-900" style={{ fontFamily: "'Crimson Text', serif", fontSize: "1.1rem" }}>
                                {format(day, "d")}
                              </p>
                            </div>
                            <div className="text-xs text-amber-800/70">
                              {dayReservations.length > 0 && (
                                <p className="font-semibold">{dayReservations.length} RDV</p>
                              )}
                              {dayVisits > 0 && (
                                <p className="text-amber-700">{dayVisits} visites</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {viewMode === "week" && (
                  <div className="space-y-3">
                    {calendarDays.map((day, idx) => {
                      const dateStr = format(day, "yyyy-MM-dd");
                      const dayReservations = reservationsByDate[dateStr] || [];
                      const dayVisits = dailyVisitors.find((dv) => dv.date === dateStr)?.visitCount || 0;
                      const isSelected = selectedDate === dateStr;

                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? "border-accent bg-accent/20"
                              : "border-amber-700/30 bg-amber-50/30 hover:border-amber-700/50"
                          }`}
                        >
                          <p className="font-bold text-amber-900" style={{ fontFamily: "'Crimson Text', serif" }}>
                            {format(day, "EEEE d MMMM", { locale: fr })}
                          </p>
                          <p className="text-sm text-amber-800/70">
                            {dayReservations.length} RDV • {dayVisits} visites
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {viewMode === "day" && (
                  <div className="text-center">
                    <p className="font-bold text-2xl text-amber-900 mb-4" style={{ fontFamily: "'Crimson Text', serif" }}>
                      {format(currentDate, "EEEE d MMMM yyyy", { locale: fr })}
                    </p>
                    <div className="space-y-2 text-amber-800/70">
                      <p>
                        <span className="font-semibold">{selectedDateReservations.length}</span> réservation(s)
                      </p>
                      <p>
                        <span className="font-semibold">
                          {dailyVisitors.find((dv) => dv.date === format(currentDate, "yyyy-MM-dd"))?.visitCount || 0}
                        </span>{" "}
                        visite(s)
                      </p>
                    </div>
                  </div>
                )}
              </Card>
          </div>

          {/* Sidebar - Selected Date Details */}
          <div>
            <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border-amber-700/30 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-amber-900 mb-4" style={{ fontFamily: "'Crimson Text', serif" }}>
                {selectedDate ? format(new Date(selectedDate + "T00:00:00"), "d MMMM yyyy", { locale: fr }) : "Sélectionnez un jour"}
              </h3>

              {selectedDate && selectedDateReservations.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-700/20">
                    <p className="text-xs text-amber-700 font-semibold mb-1">PROCHAIN CLIENT</p>
                    <p className="font-bold text-amber-900" style={{ fontFamily: "'Crimson Text', serif" }}>
                      {selectedDateReservations[0].firstName} {selectedDateReservations[0].lastName}
                    </p>
                    <p className="text-sm text-amber-800">
                      {selectedDateReservations[0].startTime} - {selectedDateReservations[0].endTime}
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      📞 {selectedDateReservations[0].phone}
                    </p>
                  </div>

                  <div className="border-t border-amber-700/20 pt-4">
                    <p className="text-xs text-amber-700 font-semibold mb-3">RÉSERVATIONS DU JOUR ({selectedDateReservations.length})</p>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {selectedDateReservations.map((res, idx) => (
                        <div key={idx} className="bg-amber-50/50 p-2 rounded border border-amber-700/20">
                          <p className="font-semibold text-sm text-amber-900">
                            {res.startTime} - {res.firstName} {res.lastName}
                          </p>
                          <p className="text-xs text-amber-700">
                            {res.consultationType} • {res.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : selectedDate ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-amber-700/30 mx-auto mb-2" />
                  <p className="text-sm text-amber-800/70">Aucune réservation ce jour</p>
                </div>
              ) : (
                <p className="text-sm text-amber-800/70 text-center py-8">Cliquez sur un jour pour voir les détails</p>
              )}

              {/* Blocked Time Slots Section */}
              {selectedDate && (
                <div className="mt-6 border-t border-amber-700/20 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-amber-700 font-semibold flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      CRÉNEAUX BLOQUÉS
                    </p>
                    <Button
                      size="sm"
                      onClick={() => setShowBlockModal(true)}
                      className="bg-amber-700 hover:bg-amber-800 text-white text-xs"
                    >
                      + Bloquer
                    </Button>
                  </div>
                  {selectedDateBlockedSlots.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDateBlockedSlots.map((slot) => (
                        <div key={slot.id} className="bg-red-50/50 p-2 rounded border border-red-700/20 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm text-red-900">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            {slot.reason && (
                              <p className="text-xs text-red-700">{slot.reason}</p>
                            )}
                          </div>
                          <button
                            onClick={() => unblockTimeSlot.mutate({ id: slot.id })}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Débloquer"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-amber-700/60">Aucun créneau bloqué</p>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Block Time Slot Modal */}
      <BlockTimeSlotModal
        date={selectedDate || ""}
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onSuccess={() => refetchBlockedSlots()}
      />
    </div>
  );
}
