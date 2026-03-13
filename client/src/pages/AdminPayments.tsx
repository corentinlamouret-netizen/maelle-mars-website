import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function AdminPayments() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [payments, setPayments] = useState<any[]>([]);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Fetch all payments
  const { data: paymentsData, isLoading } = trpc.admin.getAllPayments.useQuery(
    undefined,
    {
      enabled: user?.role === "admin",
    }
  );

  useEffect(() => {
    if (paymentsData) {
      setPayments(paymentsData);
    }
  }, [paymentsData]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Complété";
      case "pending":
        return "En attente";
      case "failed":
        return "Échoué";
      case "refunded":
        return "Remboursé";
      default:
        return status;
    }
  };

  const totalRevenue = payments
    .filter((p) => p.paymentStatus === "completed")
    .reduce((sum, p) => sum + p.amount, 0) / 100;

  const completedPayments = payments.filter(
    (p) => p.paymentStatus === "completed"
  ).length;
  const pendingPayments = payments.filter(
    (p) => p.paymentStatus === "pending"
  ).length;
  const failedPayments = payments.filter(
    (p) => p.paymentStatus === "failed"
  ).length;

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Historique des Paiements
          </h1>
          <p className="text-purple-200">
            Gérez et suivez tous les paiements PayPal
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">
                Revenu Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {totalRevenue.toFixed(2)}€
              </div>
              <p className="text-xs text-purple-300 mt-1">
                Paiements complétés
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">
                Complétés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {completedPayments}
              </div>
              <p className="text-xs text-purple-300 mt-1">Paiements</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">
                En Attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                {pendingPayments}
              </div>
              <p className="text-xs text-purple-300 mt-1">Paiements</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-purple-400/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">
                Échoués
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">
                {failedPayments}
              </div>
              <p className="text-xs text-purple-300 mt-1">Paiements</p>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card className="bg-white/10 border-purple-400/30">
          <CardHeader>
            <CardTitle className="text-white">Liste des Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-purple-200">
                Chargement des paiements...
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 text-purple-200">
                Aucun paiement trouvé
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-purple-400/30">
                      <th className="text-left py-3 px-4 text-purple-200 font-semibold">
                        ID Transaction
                      </th>
                      <th className="text-left py-3 px-4 text-purple-200 font-semibold">
                        Montant
                      </th>
                      <th className="text-left py-3 px-4 text-purple-200 font-semibold">
                        Statut
                      </th>
                      <th className="text-left py-3 px-4 text-purple-200 font-semibold">
                        Payeur
                      </th>
                      <th className="text-left py-3 px-4 text-purple-200 font-semibold">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-purple-400/20 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4 text-white font-mono text-xs">
                          {payment.paypalTransactionId.substring(0, 20)}...
                        </td>
                        <td className="py-3 px-4 text-white font-semibold">
                          {(payment.amount / 100).toFixed(2)}€
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              payment.paymentStatus
                            )}`}
                          >
                            {getStatusLabel(payment.paymentStatus)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-purple-200">
                          {payment.payerName || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-purple-200 text-xs">
                          {formatDate(payment.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => {
              const csv = [
                ["ID Transaction", "Montant", "Statut", "Payeur", "Date"],
                ...payments.map((p) => [
                  p.paypalTransactionId,
                  (p.amount / 100).toFixed(2),
                  getStatusLabel(p.paymentStatus),
                  p.payerName || "N/A",
                  formatDate(p.createdAt),
                ]),
              ]
                .map((row) => row.join(","))
                .join("\n");

              const blob = new Blob([csv], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `paiements-${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
            }}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Exporter en CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
