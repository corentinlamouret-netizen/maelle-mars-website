import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface Event {
  id: number;
  title: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  status: string;
}

export function UpcomingEventsWidget() {
  const { data: events = [], isLoading } = trpc.events.getUpcoming.useQuery();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
    });
  };

  const getAvailablePlaces = (event: Event) => {
    return event.maxAttendees - event.currentAttendees;
  };

  // Afficher seulement les 3 premiers événements
  const upcomingEvents = events.slice(0, 3);

  if (isLoading || upcomingEvents.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">Événements à Venir</h3>
        <p className="text-sm text-gray-600">Découvrez nos prochains événements</p>
      </div>

      <div className="space-y-3">
        {upcomingEvents.map((event: Event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg p-4 border border-purple-100 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Date Badge */}
              <div className="flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-lg p-2 text-center min-w-14">
                <div className="text-xs font-semibold">{formatDate(event.eventDate).split(" ")[0]}</div>
                <div className="text-sm font-bold">{formatDate(event.eventDate).split(" ")[1]}</div>
              </div>

              {/* Event Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm truncate">{event.title}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {event.startTime} - {event.endTime}
                </div>
              </div>

              {/* Availability */}
              <div className="flex-shrink-0">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    getAvailablePlaces(event) === 0
                      ? "bg-red-100 text-red-800"
                      : getAvailablePlaces(event) <= 3
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {getAvailablePlaces(event)} place{getAvailablePlaces(event) !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <Link href="/evenements">
        <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
          Voir tous les événements
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </Card>
  );
}
