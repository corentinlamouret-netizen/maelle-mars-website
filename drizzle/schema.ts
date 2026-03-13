import { 
  bigint, 
  pgEnum, 
  pgTable, 
  text, 
  timestamp, 
  varchar, 
  integer, 
  smallint,
  date,
  index
} from "drizzle-orm/pg-core";

/**
 * PostgreSQL Schema for Maëlle Mars Website
 * Migrated from MySQL to Supabase
 */

// Define ENUM types for PostgreSQL
export const consultationTypeEnum = pgEnum("consultation_type", ["10min", "15min", "25min", "30min", "40min", "1hour"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);
export const eventStatusEnum = pgEnum("event_status", ["upcoming", "ongoing", "completed", "cancelled"]);
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// Users table (for admin authentication)
export const users = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Reservations V2 table (main reservations table)
export const reservationsV2 = pgTable("reservations_v2", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  consultationType: consultationTypeEnum("consultationType").notNull(),
  reservationDate: varchar("reservationDate", { length: 10 }).notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(),
  endTime: varchar("endTime", { length: 5 }).notNull(),
  wantsUpdates: smallint("wantsUpdates").notNull().default(0),
  acceptedTerms: smallint("acceptedTerms").notNull().default(0),
  emailSent: smallint("emailSent").notNull().default(0),
  smsSent: smallint("smsSent").notNull().default(0),
  paymentStatus: paymentStatusEnum("paymentStatus").notNull().default("pending"),
  paymentAmount: integer("paymentAmount").notNull().default(0),
  paypalTransactionId: varchar("paypalTransactionId", { length: 255 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  emailIdx: index("idx_reservations_v2_email").on(table.email),
  dateIdx: index("idx_reservations_v2_date").on(table.reservationDate),
  statusIdx: index("idx_reservations_v2_status").on(table.paymentStatus),
}));

export type ReservationV2 = typeof reservationsV2.$inferSelect;
export type InsertReservationV2 = typeof reservationsV2.$inferInsert;

// Blocked time slots table
export const blockedTimeSlots = pgTable("blockedTimeSlots", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  date: varchar("date", { length: 10 }).notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(),
  endTime: varchar("endTime", { length: 5 }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type BlockedTimeSlot = typeof blockedTimeSlots.$inferSelect;
export type InsertBlockedTimeSlot = typeof blockedTimeSlots.$inferInsert;

// PayPal payments table
export const paypalPayments = pgTable("paypal_payments", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  reservationId: bigint("reservationId", { mode: "number" }).notNull(),
  paypalTransactionId: varchar("paypalTransactionId", { length: 255 }).notNull().unique(),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("EUR"),
  paymentStatus: paymentStatusEnum("paymentStatus").notNull().default("pending"),
  payerEmail: varchar("payerEmail", { length: 320 }),
  payerName: varchar("payerName", { length: 255 }),
  webhookData: text("webhookData"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  transactionIdx: index("idx_paypal_payments_transaction").on(table.paypalTransactionId),
  reservationIdx: index("idx_paypal_payments_reservation").on(table.reservationId),
}));

export type PaypalPayment = typeof paypalPayments.$inferSelect;
export type InsertPaypalPayment = typeof paypalPayments.$inferInsert;

// Page visits tracking table
export const pageVisits = pgTable("pageVisits", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  date: varchar("date", { length: 10 }).notNull(),
  visitCount: integer("visitCount").notNull().default(1),
  uniqueVisitors: integer("uniqueVisitors").notNull().default(1),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type PageVisit = typeof pageVisits.$inferSelect;
export type InsertPageVisit = typeof pageVisits.$inferInsert;

// Events table
export const events = pgTable("events", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }).notNull(),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  eventDate: varchar("eventDate", { length: 10 }).notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(),
  endTime: varchar("endTime", { length: 5 }).notNull(),
  maxAttendees: integer("maxAttendees").notNull(),
  currentAttendees: integer("currentAttendees").notNull().default(0),
  price: integer("price").notNull().default(0),
  imageUrl: text("imageUrl"),
  status: eventStatusEnum("status").notNull().default("upcoming"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  dateIdx: index("idx_events_date").on(table.eventDate),
}));

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Event attendees table
export const eventAttendees = pgTable("event_attendees", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  eventId: bigint("eventId", { mode: "number" }).notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  numberOfPlaces: integer("numberOfPlaces").notNull().default(1),
  paymentStatus: paymentStatusEnum("paymentStatus").notNull().default("pending"),
  paymentAmount: integer("paymentAmount").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  eventIdx: index("idx_event_attendees_event").on(table.eventId),
}));

export type EventAttendee = typeof eventAttendees.$inferSelect;
export type InsertEventAttendee = typeof eventAttendees.$inferInsert;

// Clients table
export const clients = pgTable("clients", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  consultationCount: integer("consultationCount").notNull().default(0),
  wantUpdates: smallint("wantUpdates").notNull().default(0),
  wantConferences: smallint("wantConferences").notNull().default(0),
  lastConsultationDate: timestamp("lastConsultationDate"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => ({
  emailIdx: index("idx_clients_email").on(table.email),
}));

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

// Legacy tables (kept for backward compatibility, can be removed later)
export const reservations = pgTable("reservations", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  consultationType: consultationTypeEnum("consultationType").notNull(),
  selectedTime: varchar("selectedTime", { length: 50 }).notNull(),
  wantsUpdates: smallint("wantsUpdates").notNull().default(0),
  acceptedTerms: smallint("acceptedTerms").notNull().default(0),
  emailSent: smallint("emailSent").notNull().default(0),
  smsSent: smallint("smsSent").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = typeof reservations.$inferInsert;
