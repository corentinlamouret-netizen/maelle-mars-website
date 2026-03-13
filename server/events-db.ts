import { getDb } from "./db";
import { events, eventAttendees, Event, EventAttendee, InsertEvent, InsertEventAttendee } from "../drizzle/schema";
import { eq, gte, lte, and } from "drizzle-orm";

/**
 * Fonctions de gestion des événements
 */

/**
 * Obtenir tous les événements à venir
 */
export async function getUpcomingEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  return await db
    .select()
    .from(events)
    .where(
      and(
        gte(events.eventDate, today),
        eq(events.status, "upcoming")
      )
    )
    .orderBy(events.eventDate);
}

/**
 * Obtenir un événement par ID
 */
export async function getEventById(id: number): Promise<Event | null> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Créer un nouvel événement
 */
export async function createEvent(event: InsertEvent) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.insert(events).values(event);
}

/**
 * Mettre à jour un événement
 */
export async function updateEvent(
  id: number,
  updates: Partial<Omit<Event, "id" | "createdAt" | "updatedAt">>
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .update(events)
    .set(updates)
    .where(eq(events.id, id));
}

/**
 * Supprimer un événement
 */
export async function deleteEvent(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.delete(events).where(eq(events.id, id));
}

/**
 * Ajouter un participant à un événement
 */
export async function addEventAttendee(attendee: InsertEventAttendee) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Vérifier que l'événement existe
  const event = await getEventById(attendee.eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Vérifier qu'il y a de la place
  const numberOfPlaces = attendee.numberOfPlaces || 1;
  if (event.currentAttendees + numberOfPlaces > event.maxAttendees) {
    throw new Error("Not enough places available");
  }

  // Ajouter le participant
  const result = await db.insert(eventAttendees).values(attendee);

  // Mettre à jour le nombre de participants
  await db
    .update(events)
    .set({ currentAttendees: event.currentAttendees + numberOfPlaces })
    .where(eq(events.id, attendee.eventId));

  return result;
}

/**
 * Obtenir les participants d'un événement
 */
export async function getEventAttendees(eventId: number): Promise<EventAttendee[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(eventAttendees)
    .where(eq(eventAttendees.eventId, eventId));
}

/**
 * Obtenir un participant par ID
 */
export async function getAttendeeById(id: number): Promise<EventAttendee | null> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(eventAttendees)
    .where(eq(eventAttendees.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Mettre à jour le statut de paiement d'un participant
 */
export async function updateAttendeePaymentStatus(
  id: number,
  paymentStatus: "pending" | "completed" | "failed"
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .update(eventAttendees)
    .set({ paymentStatus })
    .where(eq(eventAttendees.id, id));
}

/**
 * Annuler la réservation d'un participant
 */
export async function cancelAttendeeReservation(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const attendee = await getAttendeeById(id);
  if (!attendee) {
    throw new Error("Attendee not found");
  }

  // Récupérer l'événement
  const event = await getEventById(attendee.eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Supprimer le participant
  await db.delete(eventAttendees).where(eq(eventAttendees.id, id));

  // Mettre à jour le nombre de participants
  const numberOfPlaces = attendee.numberOfPlaces || 1;
  await db
    .update(events)
    .set({ currentAttendees: Math.max(0, event.currentAttendees - numberOfPlaces) })
    .where(eq(events.id, attendee.eventId));

  return true;
}

/**
 * Obtenir les événements pour une plage de dates
 */
export async function getEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(events)
    .where(
      and(
        gte(events.eventDate, startDate),
        lte(events.eventDate, endDate)
      )
    )
    .orderBy(events.eventDate);
}
