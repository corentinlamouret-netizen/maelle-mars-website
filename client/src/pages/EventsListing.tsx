import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Clock, Users, Euro } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string | null;
  location: string;
  latitude: string | null;
  longitude: string | null;
  eventDate: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
  currentAttendees: number;
  price: number;
  imageUrl: string | null;
  status: string;
}

export default function EventsListing() {
  const { data: events = [], isLoading, error } = trpc.events.getUpcoming.useQuery();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleLocationClick = (event: Event) => {
    if (event.latitude && event.longitude) {
      setSelectedEvent(event);
      setShowMap(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAvailablePlaces = (event: Event) => {
    return event.maxAttendees - event.currentAttendees;
  };

  const getAvailabilityColor = (event: Event) => {
    const available = getAvailablePlaces(event);
    if (available === 0) return "bg-red-100 text-red-800";
    if (available <= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Chargement des événements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-600 text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Erreur lors du chargement des événements</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de section */}
        <div className="mb-16 text-center">
          <p className="text-accent text-lg mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '2px' }}>
            NOS ÉVÉNEMENTS
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Événements à Venir
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Découvrez les conférences et événements spéciaux organisés par Maelle Mars
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent/30"></div>
            <div className="text-accent/50" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.5rem' }}>✦</div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent/30"></div>
          </div>
        </div>

        {/* Section Hero avec image Amelle */}
        <div className="mb-16 relative overflow-hidden rounded-2xl shadow-2xl">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663277894285/gzructoYSIkYCicM.jpg"
            alt="Maelle Mars - Conférence Contact Début"
            className="w-full h-96 md:h-[500px] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
            <p className="text-accent text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '2px' }}>
              ÉVÉNEMENT SPÉCIAL
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Conférence - Contact Début
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Une expérience spirituelle unique en compagnie de Maelle Mars
            </p>
          </div>
        </div>

        {/* Liste des événements */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Aucun événement prévu pour le moment. Revenez bientôt !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: Event) => (
              <div
                key={event.id}
                className="group relative bg-card border border-accent/20 rounded-xl overflow-hidden transition-all duration-500 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2"
              >
                {/* Image */}
                {event.imageUrl && (
                  <div className="h-56 bg-gradient-to-br from-accent/20 to-secondary/20 overflow-hidden relative">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                )}

                {/* Contenu */}
                <div className="p-6 space-y-4">
                  {/* Titre */}
                  <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {event.title}
                  </h3>

                  {/* Description */}
                  {event.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {event.description}
                    </p>
                  )}

                  {/* Détails */}
                  <div className="space-y-3 pt-4 border-t border-accent/20">
                    {/* Date */}
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-5 h-5 text-accent" />
                      <span className="text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {formatDate(event.eventDate)}
                      </span>
                    </div>

                    {/* Heure */}
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="w-5 h-5 text-accent" />
                      <span className="text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>

                    {/* Lieu */}
                    <div
                      className="flex items-center gap-3 text-muted-foreground cursor-pointer hover:text-accent transition-colors duration-300"
                      onClick={() => handleLocationClick(event)}
                    >
                      <MapPin className="w-5 h-5 text-accent" />
                      <span className="text-sm underline" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {event.location}
                      </span>
                    </div>

                    {/* Places disponibles */}
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-accent" />
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${getAvailabilityColor(event)}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {getAvailablePlaces(event)} place{getAvailablePlaces(event) > 1 ? "s" : ""} disponible{getAvailablePlaces(event) > 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Prix */}
                    {event.price > 0 && (
                      <div className="flex items-center gap-3 text-foreground font-semibold">
                        <Euro className="w-5 h-5 text-accent" />
                        <span className="text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {(event.price / 100).toFixed(2)}€
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bouton de réservation */}
                  <Button
                    className="w-full mt-6 bg-accent hover:bg-accent/90 text-background font-semibold transition-all duration-300"
                    disabled={getAvailablePlaces(event) === 0}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {getAvailablePlaces(event) === 0 ? "Complet" : "Réserver une place"}
                  </Button>
                </div>

                {/* Ligne décorative au survol */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Google Maps */}
        {showMap && selectedEvent && selectedEvent.latitude && selectedEvent.longitude && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full border border-accent/20">
              {/* En-tête */}
              <div className="flex justify-between items-center p-6 border-b border-accent/20">
                <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedEvent.location}
                </h3>
                <button
                  onClick={() => setShowMap(false)}
                  className="text-muted-foreground hover:text-foreground text-3xl transition-colors duration-300"
                >
                  ×
                </button>
              </div>

              {/* Carte */}
              <div className="w-full h-96 overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(
                    selectedEvent.location
                  )}`}
                ></iframe>
              </div>

              {/* Coordonnées */}
              <div className="p-6 border-t border-accent/20 space-y-4">
                <div className="text-sm text-muted-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <p className="font-semibold text-foreground mb-2">Coordonnées GPS :</p>
                  <p>{selectedEvent.latitude}, {selectedEvent.longitude}</p>
                </div>

                <Button
                  onClick={() => setShowMap(false)}
                  className="w-full bg-accent hover:bg-accent/90 text-background font-semibold"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
