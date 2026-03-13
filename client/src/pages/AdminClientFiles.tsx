import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Trash2 } from "lucide-react";

type SortField = "name" | "consultations" | "wantUpdates" | "wantConferences";
type SortOrder = "asc" | "desc";

export default function AdminClientFiles() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUpdates, setFilterUpdates] = useState<boolean | null>(null);
  const [filterConferences, setFilterConferences] = useState<boolean | null>(null);

  // Fetch clients from database
  const { data: clients = [], isLoading, error } = trpc.clients.getAll.useQuery(
    undefined,
    {
      enabled: user?.role === "admin" && !authLoading,
    }
  );

  const deleteClientMutation = trpc.clients.delete.useMutation();
  const utils = trpc.useUtils();

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

  // Filter clients
  const filteredClients = useMemo(() => {
    let filtered = clients.filter((client) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        client.firstName.toLowerCase().includes(searchLower) ||
        client.lastName.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.includes(searchTerm);

      const matchesUpdates =
        filterUpdates === null || client.wantUpdates === (filterUpdates ? 1 : 0);
      const matchesConferences =
        filterConferences === null ||
        client.wantConferences === (filterConferences ? 1 : 0);

      return matchesSearch && matchesUpdates && matchesConferences;
    });

    // Sort clients
    filtered.sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      if (sortField === "name") {
        aVal = `${a.lastName} ${a.firstName}`.toLowerCase();
        bVal = `${b.lastName} ${b.firstName}`.toLowerCase();
      } else if (sortField === "consultations") {
        aVal = a.consultationCount;
        bVal = b.consultationCount;
      } else if (sortField === "wantUpdates") {
        aVal = a.wantUpdates;
        bVal = b.wantUpdates;
      } else if (sortField === "wantConferences") {
        aVal = a.wantConferences;
        bVal = b.wantConferences;
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clients, searchTerm, filterUpdates, filterConferences, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await deleteClientMutation.mutateAsync({ id });
        await utils.clients.getAll.invalidate();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Prénom",
      "Nom",
      "Email",
      "Téléphone",
      "Consultations",
      "Offres Promotionnelles",
      "Conférences & Salons",
      "Dernière Consultation",
    ];

    const rows = filteredClients.map((client) => [
      client.firstName,
      client.lastName,
      client.email,
      client.phone,
      client.consultationCount,
      client.wantUpdates ? "Oui" : "Non",
      client.wantConferences ? "Oui" : "Non",
      client.lastConsultationDate
        ? new Date(client.lastConsultationDate).toLocaleDateString("fr-FR")
        : "-",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `clients-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = {
    total: clients.length,
    withUpdates: clients.filter((c) => c.wantUpdates).length,
    withConferences: clients.filter((c) => c.wantConferences).length,
    totalConsultations: clients.reduce((sum, c) => sum + c.consultationCount, 0),
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl text-accent font-light mb-4">
            Fichier Clients
          </h1>
          <p className="text-foreground/70">
            Gérez et consultez les informations de vos clients
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-accent/20 p-6">
            <div className="text-sm text-foreground/70">Total Clients</div>
            <div className="text-3xl font-bold text-accent">{stats.total}</div>
          </Card>
          <Card className="bg-card border-accent/20 p-6">
            <div className="text-sm text-foreground/70">Consultations</div>
            <div className="text-3xl font-bold text-accent">{stats.totalConsultations}</div>
          </Card>
          <Card className="bg-card border-accent/20 p-6">
            <div className="text-sm text-foreground/70">Offres Promo</div>
            <div className="text-3xl font-bold text-accent">{stats.withUpdates}</div>
          </Card>
          <Card className="bg-card border-accent/20 p-6">
            <div className="text-sm text-foreground/70">Conférences</div>
            <div className="text-3xl font-bold text-accent">{stats.withConferences}</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border border-accent/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Recherche
              </label>
              <Input
                placeholder="Nom, email, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Offres Promo
              </label>
              <select
                value={filterUpdates === null ? "" : filterUpdates ? "yes" : "no"}
                onChange={(e) => {
                  if (e.target.value === "") setFilterUpdates(null);
                  else setFilterUpdates(e.target.value === "yes");
                }}
                className="w-full px-4 py-2 bg-background border border-accent/30 rounded-lg text-foreground focus:outline-none focus:border-accent"
              >
                <option value="">Tous</option>
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Conférences
              </label>
              <select
                value={filterConferences === null ? "" : filterConferences ? "yes" : "no"}
                onChange={(e) => {
                  if (e.target.value === "") setFilterConferences(null);
                  else setFilterConferences(e.target.value === "yes");
                }}
                className="w-full px-4 py-2 bg-background border border-accent/30 rounded-lg text-foreground focus:outline-none focus:border-accent"
              >
                <option value="">Tous</option>
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleExportCSV}
                className="w-full bg-accent text-background hover:bg-accent/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-card border border-accent/20 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin w-8 h-8 text-accent" />
            </div>
          ) : error ? (
            <div className="p-8 text-red-400">Erreur lors du chargement des clients</div>
          ) : filteredClients.length === 0 ? (
            <div className="p-8 text-center text-foreground/70">Aucun client trouvé</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent/10 border-b border-accent/20">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-accent cursor-pointer hover:text-accent/80"
                      onClick={() => handleSort("name")}
                    >
                      Nom {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-accent">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-accent">
                      Téléphone
                    </th>
                    <th
                      className="px-6 py-4 text-center text-sm font-semibold text-accent cursor-pointer hover:text-accent/80"
                      onClick={() => handleSort("consultations")}
                    >
                      Consultations{" "}
                      {sortField === "consultations" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-4 text-center text-sm font-semibold text-accent cursor-pointer hover:text-accent/80"
                      onClick={() => handleSort("wantUpdates")}
                    >
                      Offres {sortField === "wantUpdates" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-4 text-center text-sm font-semibold text-accent cursor-pointer hover:text-accent/80"
                      onClick={() => handleSort("wantConferences")}
                    >
                      Conférences{" "}
                      {sortField === "wantConferences" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-accent">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-accent/10 hover:bg-accent/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-foreground">
                        {client.firstName} {client.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">{client.email}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70">{client.phone}</td>
                      <td className="px-6 py-4 text-sm text-center text-foreground">
                        {client.consultationCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-foreground">
                        {client.wantUpdates ? "✓" : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-foreground">
                        {client.wantConferences ? "✓" : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClient(client.id)}
                          disabled={deleteClientMutation.isPending}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
