-- Supabase PostgreSQL Schema for Maëlle Mars Website (Safe Version)
-- This version ignores existing types and creates only missing tables

-- Create ENUM types (IF NOT EXISTS - using DO block for compatibility)
DO $$ BEGIN
    CREATE TYPE consultation_type AS ENUM ('10min', '15min', '25min', '30min', '40min', '1hour');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Users table (for admin authentication)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role user_role NOT NULL DEFAULT 'user',
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  lastSignedIn TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Reservations V2 table (main reservations table)
CREATE TABLE IF NOT EXISTS reservations_v2 (
  id BIGSERIAL PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  consultationType consultation_type NOT NULL,
  reservationDate VARCHAR(10) NOT NULL,
  startTime VARCHAR(5) NOT NULL,
  endTime VARCHAR(5) NOT NULL,
  wantsUpdates SMALLINT NOT NULL DEFAULT 0,
  acceptedTerms SMALLINT NOT NULL DEFAULT 0,
  emailSent SMALLINT NOT NULL DEFAULT 0,
  smsSent SMALLINT NOT NULL DEFAULT 0,
  paymentStatus payment_status NOT NULL DEFAULT 'pending',
  paymentAmount INTEGER NOT NULL DEFAULT 0,
  paypalTransactionId VARCHAR(255),
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_reservations_v2_email ON reservations_v2(email);
CREATE INDEX IF NOT EXISTS idx_reservations_v2_date ON reservations_v2(reservationDate);
CREATE INDEX IF NOT EXISTS idx_reservations_v2_status ON reservations_v2(paymentStatus);

-- Blocked time slots table
CREATE TABLE IF NOT EXISTS blockedTimeSlots (
  id BIGSERIAL PRIMARY KEY,
  date VARCHAR(10) NOT NULL,
  startTime VARCHAR(5) NOT NULL,
  endTime VARCHAR(5) NOT NULL,
  reason TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- PayPal payments table
CREATE TABLE IF NOT EXISTS paypal_payments (
  id BIGSERIAL PRIMARY KEY,
  reservationId BIGINT NOT NULL,
  paypalTransactionId VARCHAR(255) NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
  paymentStatus payment_status NOT NULL DEFAULT 'pending',
  payerEmail VARCHAR(320),
  payerName VARCHAR(255),
  webhookData TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paypal_payments_transaction ON paypal_payments(paypalTransactionId);
CREATE INDEX IF NOT EXISTS idx_paypal_payments_reservation ON paypal_payments(reservationId);

-- Page visits tracking table
CREATE TABLE IF NOT EXISTS pageVisits (
  id BIGSERIAL PRIMARY KEY,
  date VARCHAR(10) NOT NULL,
  visitCount INTEGER NOT NULL DEFAULT 1,
  uniqueVisitors INTEGER NOT NULL DEFAULT 1,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  latitude VARCHAR(20),
  longitude VARCHAR(20),
  eventDate VARCHAR(10) NOT NULL,
  startTime VARCHAR(5) NOT NULL,
  endTime VARCHAR(5) NOT NULL,
  maxAttendees INTEGER NOT NULL,
  currentAttendees INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL DEFAULT 0,
  imageUrl TEXT,
  status event_status NOT NULL DEFAULT 'upcoming',
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(eventDate);

-- Event attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id BIGSERIAL PRIMARY KEY,
  eventId BIGINT NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  numberOfPlaces INTEGER NOT NULL DEFAULT 1,
  paymentStatus payment_status NOT NULL DEFAULT 'pending',
  paymentAmount INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_attendees_event ON event_attendees(eventId);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  consultationCount INTEGER NOT NULL DEFAULT 0,
  wantUpdates SMALLINT NOT NULL DEFAULT 0,
  wantConferences SMALLINT NOT NULL DEFAULT 0,
  lastConsultationDate TIMESTAMP,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Legacy reservations table (kept for backward compatibility)
CREATE TABLE IF NOT EXISTS reservations (
  id BIGSERIAL PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  consultationType consultation_type NOT NULL,
  selectedTime VARCHAR(50) NOT NULL,
  wantsUpdates SMALLINT NOT NULL DEFAULT 0,
  acceptedTerms SMALLINT NOT NULL DEFAULT 0,
  emailSent SMALLINT NOT NULL DEFAULT 0,
  smsSent SMALLINT NOT NULL DEFAULT 0,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create testimonials table (if not already exists)
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  clientName VARCHAR(255) NOT NULL,
  clientEmail VARCHAR(320),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
