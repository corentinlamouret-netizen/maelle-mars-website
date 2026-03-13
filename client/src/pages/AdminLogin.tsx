import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function AdminLogin() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already admin
  if (!authLoading && user?.role === "admin") {
    setLocation("/admin/fichierclient");
    return null;
  }

  // If not authenticated, show login button
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-background flex items-center justify-center">
        <div className="container mx-auto max-w-md">
          <Card className="bg-card border border-accent/20 p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl text-accent font-light mb-2">
                Espace Admin
              </h1>
              <p className="text-foreground/70">
                Connectez-vous pour accéder au fichier clients
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="w-full bg-accent text-background hover:bg-accent/90 py-6 text-lg"
              >
                Se connecter avec Manus
              </Button>
              <p className="text-sm text-foreground/50 text-center">
                Seuls les administrateurs peuvent accéder à cette page.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // If authenticated but not admin
  if (!authLoading && isAuthenticated && user?.role !== "admin") {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-background flex items-center justify-center">
        <div className="container mx-auto max-w-md">
          <Card className="bg-card border border-accent/20 p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl text-accent font-light mb-2">
                Accès Refusé
              </h1>
              <p className="text-foreground/70">
                Vous n'avez pas les permissions pour accéder à cette page.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setLocation("/")}
                className="w-full bg-accent text-background hover:bg-accent/90"
              >
                Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin w-8 h-8 text-accent" />
    </div>
  );
}
