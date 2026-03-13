import { getDb } from "./db";
import { reservationsV2, ReservationV2 } from "../drizzle/schema";
import { eq, and, gte, lte, like, or } from "drizzle-orm";

/**
 * Fonctions de gestion des réservations
 * Permet de modifier, annuler et rechercher les réservations
 */

/**
 * Obtenir une réservation par ID
 */
export async function getReservationById(id: number): Promise<ReservationV2 | null> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(reservationsV2)
    .where(eq(reservationsV2.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Mettre à jour une réservation
 */
export async function updateReservation(
  id: number,
  updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    reservationDate?: string;
    startTime?: string;
    endTime?: string;
    consultationType?: "10min" | "15min" | "25min" | "30min" | "40min" | "1hour";
    wantsUpdates?: number;
    acceptedTerms?: number;
  }
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    await db
      .update(reservationsV2)
      .set(updates)
      .where(eq(reservationsV2.id, id));

    console.log("[Reservation] Updated reservation:", id);
    return true;
  } catch (error) {
    console.error("[Reservation] Error updating reservation:", error);
    throw error;
  }
}

/**
 * Annuler une réservation (soft delete)
 */
export async function cancelReservation(id: number, reason?: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Marquer la réservation comme annulée en changeant la date à une date très ancienne
    // ou en utilisant un champ de statut (à implémenter dans le schéma)
    // Pour maintenant, on supprime simplement la réservation
    await db.delete(reservationsV2).where(eq(reservationsV2.id, id));

    console.log("[Reservation] Cancelled reservation:", id, reason ? `(${reason})` : "");
    return true;
  } catch (error) {
    console.error("[Reservation] Error cancelling reservation:", error);
    throw error;
  }
}

/**
 * Rechercher des réservations par email
 */
export async function searchReservationsByEmail(email: string): Promise<ReservationV2[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(reservationsV2)
    .where(like(reservationsV2.email, `%${email}%`));
}

/**
 * Rechercher des réservations par nom
 */
export async function searchReservationsByName(name: string): Promise<ReservationV2[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(reservationsV2)
    .where(
      or(
        like(reservationsV2.firstName, `%${name}%`),
        like(reservationsV2.lastName, `%${name}%`)
      )
    );
}

/**
 * Rechercher des réservations par date
 */
export async function searchReservationsByDateRange(
  startDate: string,
  endDate: string
): Promise<ReservationV2[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(reservationsV2)
    .where(
      and(
        gte(reservationsV2.reservationDate, startDate),
        lte(reservationsV2.reservationDate, endDate)
      )
    )
    .orderBy(reservationsV2.reservationDate);
}

/**
 * Rechercher des réservations par type de consultation
 */
export async function searchReservationsByType(
  consultationType: "10min" | "15min" | "25min" | "30min" | "40min" | "1hour"
): Promise<ReservationV2[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(reservationsV2)
    .where(eq(reservationsV2.consultationType, consultationType));
}

/**
 * Rechercher des réservations par statut de paiement
 */
export async function searchReservationsByPaymentStatus(
  status: "pending" | "completed" | "failed"
): Promise<ReservationV2[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(reservationsV2)
    .where(eq(reservationsV2.paymentStatus, status));
}

/**
 * Exporter les réservations au format CSV
 */
export async function exportReservationsAsCSV(
  reservations: ReservationV2[]
): Promise<string> {
  const headers = [
    "ID",
    "Prénom",
    "Nom",
    "Email",
    "Téléphone",
    "Adresse",
    "Type de consultation",
    "Date",
    "Heure de début",
    "Heure de fin",
    "Statut de paiement",
    "Montant",
    "Date de création",
  ];

  const rows = reservations.map((r) => [
    r.id,
    r.firstName,
    r.lastName,
    r.email,
    r.phone,
    r.address,
    r.consultationType,
    r.reservationDate,
    r.startTime,
    r.endTime,
    r.paymentStatus,
    r.paymentAmount,
    r.createdAt,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csv;
}


