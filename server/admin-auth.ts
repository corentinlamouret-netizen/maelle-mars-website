import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Admin Authentication Module
 * Gère l'authentification des administrateurs
 */

export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AdminSession {
  userId: number;
  email: string;
  name: string;
  role: "admin" | "user";
  expiresAt: Date;
}

/**
 * Vérifier si un utilisateur est admin
 */
export async function isUserAdmin(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user.length > 0 && user[0].role === "admin";
  } catch (error) {
    console.error("[Admin Auth] Error checking admin status:", error);
    return false;
  }
}

/**
 * Vérifier si un email est admin
 */
export async function isEmailAdmin(email: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user.length > 0 && user[0].role === "admin";
  } catch (error) {
    console.error("[Admin Auth] Error checking admin email:", error);
    return false;
  }
}

/**
 * Promouvoir un utilisateur en admin
 * À utiliser uniquement via la base de données ou un script d'administration
 */
export async function promoteUserToAdmin(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }

  try {
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.id, userId));

    console.log("[Admin Auth] User promoted to admin:", userId);
    return true;
  } catch (error) {
    console.error("[Admin Auth] Error promoting user:", error);
    return false;
  }
}

/**
 * Retirer les droits admin d'un utilisateur
 */
export async function demoteAdminToUser(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }

  try {
    await db
      .update(users)
      .set({ role: "user" })
      .where(eq(users.id, userId));

    console.log("[Admin Auth] Admin demoted to user:", userId);
    return true;
  } catch (error) {
    console.error("[Admin Auth] Error demoting admin:", error);
    return false;
  }
}

/**
 * Vérifier si un utilisateur a accès au dashboard admin
 * Utilise le contexte de la requête pour vérifier l'authentification et le rôle
 */
export async function canAccessAdminDashboard(userId: number | undefined): Promise<boolean> {
  if (!userId) {
    return false;
  }

  return await isUserAdmin(userId);
}

/**
 * Notes de sécurité:
 * 
 * 1. Le système utilise l'authentification OAuth Manus existante
 * 2. Le rôle "admin" est stocké dans la table users
 * 3. Pour promouvoir un utilisateur en admin:
 *    - Utiliser la base de données directement
 *    - Ou créer un script d'administration sécurisé
 * 
 * 4. Exemple de promotion via SQL:
 *    UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
 * 
 * 5. Les routes admin doivent vérifier:
 *    - L'utilisateur est authentifié (ctx.user existe)
 *    - L'utilisateur a le rôle 'admin'
 */
