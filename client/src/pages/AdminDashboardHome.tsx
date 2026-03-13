import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Users, Calendar, TrendingUp, AlertCircle, Star, MessageCircle, CheckCircle, Clock, Eye } from "lucide-react";
import { useState } from "react";

export default function AdminDashboardHome() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'stats' | 'testimonials' | 'agenda' | 'visits'>('stats');

  // Fetch clients data
  const { data: clients = [], isLoading: clientsLoading } = trpc.clients.getAll.useQuery(
    undefined,
    {
      enabled: user?.role === "admin" && !authLoading,
    }
  );

  // Testimonials endpoints not yet implemented
  const testimonials: any[] = [];
  const testimonialsLoading = false;
  const publishedTestimonials: any[] = [];

  // Fetch reservations for agenda
  const { data: allReservations = [] } = trpc.admin.getAllReservations.useQuery(
    undefined,
    {
      enabled: user?.role === "admin" && !authLoading,
    }
  );

  // Fetch daily visitors
  const currentDate = new Date();
  const { data: dailyVisitors = [] } = trpc.admin.getDailyVisitors.useQuery(
    {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
    },
    {
      enabled: user?.role === "admin" && !authLoading,
    }
  );

  // Redirect if not admin
  if (!authLoading && user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    totalClients: clients.length,
    clientsWithUpdates: clients.filter((c) => c.wantUpdates).length,
    clientsWithConferences: clients.filter((c) => c.wantConferences).length,
    totalConsultations: clients.reduce((sum, c) => sum + c.consultationCount, 0),
    averageConsultationsPerClient:
      clients.length > 0
        ? (clients.reduce((sum, c) => sum + c.consultationCount, 0) / clients.length).toFixed(1)
        : 0,
    totalTestimonials: publishedTestimonials.length,
    averageRating: publishedTestimonials.length > 0
      ? (publishedTestimonials.reduce((sum: number, t: any) => sum + (t.rating || 0), 0) / publishedTestimonials.length).toFixed(1)
      : 0,
    pendingTestimonials: testimonials.length,
  };

  // Group clients by consultation count
  const consultationDistribution = {
    "0": clients.filter((c) => c.consultationCount === 0).length,
    "1-2": clients.filter((c) => c.consultationCount >= 1 && c.consultationCount <= 2).length,
    "3-5": clients.filter((c) => c.consultationCount >= 3 && c.consultationCount <= 5).length,
    "6+": clients.filter((c) => c.consultationCount > 5).length,
  };

  const isLoading = clientsLoading || testimonialsLoading;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl text-accent font-light mb-2">
            Tableau de Bord Admin
          </h1>
          <p className="text-foreground/70">
            Bienvenue {user?.name}, gérez vos consultations et avis
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-accent/20 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'stats'
                ? 'text-accent border-accent'
                : 'text-foreground/60 hover:text-foreground border-transparent'
            }`}
          >
            <TrendingUp className="inline mr-2 w-4 h-4" />
            Statistiques
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 relative whitespace-nowrap ${
              activeTab === 'testimonials'
                ? 'text-accent border-accent'
                : 'text-foreground/60 hover:text-foreground border-transparent'
            }`}
          >
            <MessageCircle className="inline mr-2 w-4 h-4" />
            Avis & Temoignages
            {stats.pendingTestimonials > 0 && (
              <span className="absolute top-1 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {stats.pendingTestimonials}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'agenda'
                ? 'text-accent border-accent'
                : 'text-foreground/60 hover:text-foreground border-transparent'
            }`}
          >
            <Calendar className="inline mr-2 w-4 h-4" />
            Agenda
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`px-4 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'visits'
                ? 'text-accent border-accent'
                : 'text-foreground/60 hover:text-foreground border-transparent'
            }`}
          >
            <Eye className="inline mr-2 w-4 h-4" />
            Visites du Site
          </button>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <>
            {/* Main Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Clients */}
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 p-6 hover:border-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground/70 mb-2 font-medium">Clients Total</p>
                    <p className="text-3xl font-bold text-accent">{stats.totalClients}</p>
                    <p className="text-xs text-foreground/50 mt-2">
                      {stats.clientsWithUpdates} interesses par les offres
                    </p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </Card>

              {/* Total Consultations */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30 p-6 hover:border-blue-500/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground/70 mb-2 font-medium">Consultations</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.totalConsultations}</p>
                    <p className="text-xs text-foreground/50 mt-2">
                      {stats.averageConsultationsPerClient} par client
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </Card>

              {/* Total Testimonials */}
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 p-6 hover:border-green-500/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground/70 mb-2 font-medium">Avis Publies</p>
                    <p className="text-3xl font-bold text-green-400">{stats.totalTestimonials}</p>
                    <p className="text-xs text-foreground/50 mt-2">
                      * {stats.averageRating}/5 en moyenne
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Star className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </Card>

              {/* Engagement Rate */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30 p-6 hover:border-purple-500/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground/70 mb-2 font-medium">Taux Engagement</p>
                    <p className="text-3xl font-bold text-purple-400">
                      {stats.totalClients > 0
                        ? Math.round((stats.clientsWithUpdates / stats.totalClients) * 100)
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-foreground/50 mt-2">
                      Clients actifs
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Secondary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Consultation Distribution */}
              <Card className="bg-card border-accent/20 p-6">
                <h3 className="text-lg font-semibold text-accent mb-6 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Distribution des Consultations
                </h3>
                <div className="space-y-4">
                  {Object.entries({
                    "Aucune (0)": "0",
                    "1-2": "1-2",
                    "3-5": "3-5",
                    "6+": "6+"
                  }).map(([label, key]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground/70">{label}</span>
                        <span className="text-accent font-semibold">
                          {consultationDistribution[key as keyof typeof consultationDistribution]}
                        </span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-accent/50 to-accent h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              stats.totalClients > 0
                                ? (consultationDistribution[key as keyof typeof consultationDistribution] / stats.totalClients) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Client Preferences */}
              <Card className="bg-card border-accent/20 p-6">
                <h3 className="text-lg font-semibold text-accent mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Preferences Clients
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground/70">Offres Promotionnelles</span>
                      <span className="text-green-400 font-semibold">{stats.clientsWithUpdates}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500/50 to-green-400 h-3 rounded-full transition-all"
                        style={{
                          width: `${
                            stats.totalClients > 0
                              ? (stats.clientsWithUpdates / stats.totalClients) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground/70">Conferences & Salons</span>
                      <span className="text-blue-400 font-semibold">{stats.clientsWithConferences}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500/50 to-blue-400 h-3 rounded-full transition-all"
                        style={{
                          width: `${
                            stats.totalClients > 0
                              ? (stats.clientsWithConferences / stats.totalClients) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Rating Distribution */}
              <Card className="bg-card border-accent/20 p-6">
                <h3 className="text-lg font-semibold text-accent mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Distribution des Notes
                </h3>
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = publishedTestimonials.filter((t: any) => t.rating === rating).length;
                    const percentage = publishedTestimonials.length > 0 ? (count / publishedTestimonials.length) * 100 : 0;
                    return (
                      <div key={rating}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground/70">
                            {'*'.repeat(rating)} ({rating})
                          </span>
                          <span className="text-accent font-semibold">{count}</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-yellow-500/50 to-yellow-400 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Agenda Tab */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-accent/30 mx-auto mb-4" />
              <p className="text-lg text-foreground/60 mb-4">Agenda detaille disponible</p>
              <Button
                onClick={() => setLocation('/admin/calendar-agenda')}
                className="bg-accent hover:bg-accent/90 text-background"
              >
                Ouvrir l'Agenda Complet
              </Button>
            </div>
          </div>
        )}

        {/* Visits Tab */}
        {activeTab === 'visits' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30 p-6">
                <p className="text-sm text-foreground/70 mb-2 font-medium">Visites Total (Mois)</p>
                <p className="text-3xl font-bold text-blue-400">
                  {dailyVisitors.reduce((sum, dv) => sum + dv.visitCount, 0)}
                </p>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 p-6">
                <p className="text-sm text-foreground/70 mb-2 font-medium">Jours Actifs</p>
                <p className="text-3xl font-bold text-green-400">{dailyVisitors.length}</p>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30 p-6">
                <p className="text-sm text-foreground/70 mb-2 font-medium">Moyenne/Jour</p>
                <p className="text-3xl font-bold text-purple-400">
                  {dailyVisitors.length > 0
                    ? Math.round(dailyVisitors.reduce((sum, dv) => sum + dv.visitCount, 0) / dailyVisitors.length)
                    : 0}
                </p>
              </Card>
            </div>

            <Card className="bg-card border-accent/20 p-6">
              <h3 className="text-lg font-semibold text-accent mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Visites par Jour (Mois Courant)
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {dailyVisitors.length > 0 ? (
                  dailyVisitors.map((dv) => (
                    <div key={dv.date} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <span className="font-semibold text-foreground">
                        {new Date(dv.date + 'T00:00:00').toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-foreground/70">Visites</p>
                          <p className="text-lg font-bold text-accent">{dv.visitCount}</p>
                        </div>
                        <div className="w-32 bg-background rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500/50 to-blue-400 h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                (dv.visitCount /
                                  Math.max(...dailyVisitors.map((d) => d.visitCount), 1)) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-foreground/60">Aucune donnee de visite pour ce mois</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            {/* Pending Testimonials */}
            {stats.pendingTestimonials > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-accent mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Avis en Attente de Moderation ({stats.pendingTestimonials})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((testimonial: any) => (
                    <Card key={testimonial.id} className="bg-card border-yellow-500/30 p-6 hover:border-yellow-500/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.clientName}</p>
                          <p className="text-xs text-foreground/50">{testimonial.clientEmail}</p>
                        </div>
                        <div className="text-yellow-400 font-bold">
                          {'*'.repeat(testimonial.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 mb-3 line-clamp-3">
                        {testimonial.content}
                      </p>
                      {testimonial.consultationType && (
                        <p className="text-xs text-accent/70 mb-4">
                          Consultation: {testimonial.consultationType}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs border-green-500/50 hover:border-green-500 hover:text-green-400"
                          onClick={() => {
                            console.log('Publish testimonial:', testimonial.id);
                          }}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Publier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs border-red-500/50 hover:border-red-500 hover:text-red-400"
                          onClick={() => {
                            console.log('Reject testimonial:', testimonial.id);
                          }}
                        >
                          Rejeter
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Published Testimonials */}
            <div>
              <h2 className="text-2xl font-semibold text-accent mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Avis Publies ({stats.totalTestimonials})
              </h2>
              {publishedTestimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publishedTestimonials.slice(0, 6).map((testimonial: any) => (
                    <Card key={testimonial.id} className="bg-card border-green-500/20 p-6 hover:border-green-500/40 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.clientName}</p>
                          <p className="text-xs text-foreground/50">
                            {new Date(testimonial.publishedAt || testimonial.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-yellow-400 font-bold">
                          {'*'.repeat(testimonial.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-3">
                        {testimonial.content}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card border-accent/20 p-12 text-center">
                  <MessageCircle className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                  <p className="text-foreground/60">Aucun avis publie pour le moment</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
