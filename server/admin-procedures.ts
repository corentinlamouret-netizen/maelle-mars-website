import { protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { isUserAdmin } from "./admin-auth";

/**
 * Procédure tRPC protégée pour les administrateurs
 * Vérifie que l'utilisateur est authentifié ET qu'il a le rôle admin
 */
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Vérifier que l'utilisateur est authentifié
  if (!ctx.user || !ctx.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Vous devez être connecté pour accéder à cette ressource",
    });
  }

  // Vérifier que l'utilisateur est admin
  const isAdmin = await isUserAdmin(ctx.user.id);
  if (!isAdmin) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource",
    });
  }

  return next({ ctx });
});
