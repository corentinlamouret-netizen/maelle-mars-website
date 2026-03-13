import React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Composant de protection pour les routes admin
 * Vérifie que l'utilisateur est authentifié ET qu'il a le rôle admin
 */
export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { data: adminCheck, isLoading: checkLoading } = trpc.admin.checkAccess.useQuery(
    undefined,
    { enabled: !!user }
  );

  // En attente de vérification
  if (authLoading || checkLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  // Pas d'accès admin
  if (!adminCheck?.hasAccess) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
            <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          </div>
        </div>
      )
    );
  }

  // Accès autorisé
  return <>{children}</>;
}
