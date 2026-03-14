import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
// import { sdk } from "./sdk"; // Désactivé si Manus n'est pas utilisé

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // ⚠️ Si tu n'utilises plus Manus, on peut mettre une authentification factice ou nulle
  try {
    // user = await sdk.authenticateRequest(opts.req);
    // Remplacement par null pour supprimer Manus
    user = null;
  } catch (error) {
    // Log optionnel pour debug
    console.warn("Authentication skipped:", (error as Error).message);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
