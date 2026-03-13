import { eq, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, InsertReservation, reservations, blockedTimeSlots, reservationsV2, InsertBlockedTimeSlot, InsertReservationV2, pageVisits, InsertPageVisit, paypalPayments, InsertPaypalPayment, clients, InsertClient, Client } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: postgres.Sql | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const connectionString = process.env.DATABASE_URL;
      // Configuration sécurisée pour Supabase avec postgres-js
      _client = postgres(connectionString, {
        ssl: 'require', // Force le SSL
        prepare: false  // Important pour Supabase en mode Transaction (port 6543)
      });
      _db = drizzle(_client);
      console.log("[Database] Connected to Supabase PostgreSQL successfully");
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
      _client = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // PostgreSQL upsert syntax
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Reservation queries
export async function createReservation(reservation: InsertReservation) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create reservation: database not available");
    throw new Error("Database not available");
  }

  const result = await db.insert(reservations).values(reservation);
  return result;
}

export async function updateReservationStatus(
  reservationId: number,
  emailSent: boolean,
  smsSent: boolean
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update reservation: database not available");
    throw new Error("Database not available");
  }

  await db
    .update(reservations)
    .set({
      emailSent: emailSent ? 1 : 0,
      smsSent: smsSent ? 1 : 0,
    })
    .where(eq(reservations.id, reservationId));
}

// New reservation queries with date/time support
export async function createReservationV2(reservation: InsertReservationV2) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(reservationsV2).values(reservation);
  return result;
}

// Check if a time slot is available (no conflicts with existing reservations or blocked slots)
export async function isTimeSlotAvailable(
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Convert time strings to minutes for comparison
  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const newStartMinutes = parseTime(startTime);
  const newEndMinutes = parseTime(endTime);

  // Check for conflicting reservations
  const conflictingReservations = await db
    .select()
    .from(reservationsV2)
    .where(eq(reservationsV2.reservationDate, date));

  for (const reservation of conflictingReservations) {
    const existingStart = parseTime(reservation.startTime);
    const existingEnd = parseTime(reservation.endTime);

    // Check if time slots overlap
    if (newStartMinutes < existingEnd && newEndMinutes > existingStart) {
      return false; // Conflict found
    }
  }

  // Check for blocked time slots
  const blockedSlots = await db
    .select()
    .from(blockedTimeSlots)
    .where(eq(blockedTimeSlots.date, date));

  for (const blocked of blockedSlots) {
    const blockedStart = parseTime(blocked.startTime);
    const blockedEnd = parseTime(blocked.endTime);

    // Check if time slots overlap
    if (newStartMinutes < blockedEnd && newEndMinutes > blockedStart) {
      return false; // Blocked time found
    }
  }

  return true; // Slot is available
}

// Get all reservations for a specific date
export async function getReservationsByDate(date: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(reservationsV2)
    .where(eq(reservationsV2.reservationDate, date));
}

// Get all blocked time slots for a specific date
export async function getBlockedSlotsByDate(date: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(blockedTimeSlots)
    .where(eq(blockedTimeSlots.date, date));
}

// Create a blocked time slot
export async function createBlockedTimeSlot(slot: InsertBlockedTimeSlot) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.insert(blockedTimeSlots).values(slot);
}

// Delete a blocked time slot
export async function deleteBlockedTimeSlot(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.delete(blockedTimeSlots).where(eq(blockedTimeSlots.id, id));
}

// Get all reservations (for admin dashboard)
export async function getAllReservations() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(reservationsV2);
}

// Get monthly statistics
export async function getMonthlyStats(year: number, month: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month).padStart(2, "0")}-31`;

  // Get all reservations for the month
  const reservations = await db
    .select()
    .from(reservationsV2)
    .where(
      and(
        gte(reservationsV2.reservationDate, monthStart),
        lte(reservationsV2.reservationDate, monthEnd)
      )
    );

  // Calculate statistics
  const totalReservations = reservations.length;
  const uniqueClients = new Set(reservations.map((r) => r.email)).size;
  
  // Calculate revenue based on consultation type
  const revenue = reservations.reduce((sum, r) => {
    if (r.consultationType === "25min") return sum + 70;
    if (r.consultationType === "30min") return sum + 80;
    if (r.consultationType === "40min") return sum + 110;
    if (r.consultationType === "1hour") return sum + 150;
    return sum;
  }, 0);

  return {
    totalReservations,
    uniqueClients,
    revenue,
  };
}

// Get daily visitor statistics
export async function getDailyVisitors(year: number, month: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month).padStart(2, "0")}-31`;

  return await db
    .select()
    .from(pageVisits)
    .where(
      and(
        gte(pageVisits.date, monthStart),
        lte(pageVisits.date, monthEnd)
      )
    );
}

// Track a page visit
export async function trackPageVisit(date: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Check if visit already exists for this date
  const existing = await db
    .select()
    .from(pageVisits)
    .where(eq(pageVisits.date, date))
    .limit(1);

  if (existing.length > 0) {
    // Update existing record
    await db
      .update(pageVisits)
      .set({
        visitCount: existing[0].visitCount + 1,
      })
      .where(eq(pageVisits.date, date));
  } else {
    // Create new record
    await db.insert(pageVisits).values({
      date,
      visitCount: 1,
      uniqueVisitors: 1,
    });
  }
}

// Create a PayPal payment record
export async function createPaypalPayment(payment: InsertPaypalPayment) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(paypalPayments).values(payment);
  return result;
}

// Get payment by transaction ID
export async function getPaymentByTransactionId(transactionId: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(paypalPayments)
    .where(eq(paypalPayments.paypalTransactionId, transactionId));

  return result.length > 0 ? result[0] : undefined;
}

// Update payment status
export async function updatePaymentStatus(
  paymentId: number,
  status: "pending" | "completed" | "failed" | "refunded"
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(paypalPayments)
    .set({ paymentStatus: status })
    .where(eq(paypalPayments.id, paymentId));
}

// Get reservation by ID
export async function getReservationById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(reservationsV2)
    .where(eq(reservationsV2.id, id));

  return result.length > 0 ? result[0] : undefined;
}

// Update reservation payment status
export async function updateReservationPaymentStatus(
  reservationId: number,
  status: "pending" | "completed" | "failed"
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(reservationsV2)
    .set({ paymentStatus: status, emailSent: 1 })
    .where(eq(reservationsV2.id, reservationId));
}

// Create or update client
export async function upsertClient(client: InsertClient) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    await db.insert(clients).values(client).onConflictDoUpdate({
      target: clients.email,
      set: {
        consultationCount: (clients.consultationCount as any) + 1,
        lastConsultationDate: new Date(),
      },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert client:", error);
    throw error;
  }
}

// Get client by email
export async function getClientByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.email, email));

  return result.length > 0 ? result[0] : undefined;
}

// Get all clients
export async function getAllClients() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(clients);
}

// Get all payments
export async function getAllPayments() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(paypalPayments);
}
