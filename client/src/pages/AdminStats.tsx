import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminStats() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation]);

  // Get monthly statistics
  const statsQuery = trpc.admin.getMonthlyStats.useQuery({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  });

  // Get daily visitor statistics
  const visitorsQuery = trpc.admin.getDailyVisitors.useQuery({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return <div className="text-center py-10 text-white">Accès non autorisé</div>;
  }

  const monthName = currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" });
  const stats = statsQuery.data;
  const visitors = visitorsQuery.data || [];

  // Prepare data for charts
  const visitorChartData = visitors.map((v: any) => ({
    date: v.date,
    visiteurs: v.visitCount,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Statistiques Mensuelles</h1>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
            }
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold text-white capitalize">{monthName}</h2>
          <Button
            onClick={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
            }
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-700 border-slate-600 p-6">
            <div className="text-gray-300 text-sm mb-2">Réservations</div>
            <div className="text-3xl font-bold text-amber-400">
              {stats?.totalReservations || 0}
            </div>
          </Card>

          <Card className="bg-slate-700 border-slate-600 p-6">
            <div className="text-gray-300 text-sm mb-2">Clients Uniques</div>
            <div className="text-3xl font-bold text-blue-400">
              {stats?.uniqueClients || 0}
            </div>
          </Card>

          <Card className="bg-slate-700 border-slate-600 p-6">
            <div className="text-gray-300 text-sm mb-2">Revenus Estimés</div>
            <div className="text-3xl font-bold text-green-400">
              {stats?.revenue || 0}€
            </div>
          </Card>

          <Card className="bg-slate-700 border-slate-600 p-6">
            <div className="text-gray-300 text-sm mb-2">Visiteurs Total</div>
            <div className="text-3xl font-bold text-purple-400">
              {visitors.reduce((sum: number, v: any) => sum + v.visitCount, 0)}
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visitors Chart */}
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Visiteurs par Jour</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitorChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visiteurs"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Reservations Summary */}
          <Card className="bg-slate-700 border-slate-600 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Résumé des Réservations</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Réservations:</span>
                <span className="text-2xl font-bold text-amber-400">
                  {stats?.totalReservations || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Clients Uniques:</span>
                <span className="text-2xl font-bold text-blue-400">
                  {stats?.uniqueClients || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Revenus Estimés:</span>
                <span className="text-2xl font-bold text-green-400">
                  {stats?.revenue || 0}€
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Moyenne par Client:</span>
                <span className="text-2xl font-bold text-purple-400">
                  {stats && stats.uniqueClients > 0
                    ? (stats.revenue / stats.uniqueClients).toFixed(2)
                    : 0}
                  €
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
