import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { updateReservation, cancelReservation, searchReservationsByEmail } from "./reservation-management";
import { createReservationV2, isTimeSlotAvailable, createBlockedTimeSlot, deleteBlockedTimeSlot, getAllReservations } from "./db";

/**
 * Tests du flux complet de réservation
 * Valide: création, modification, annulation, recherche
 */

describe("Reservation Flow", () => {
  const testReservation = {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "06 12 34 56 78",
    address: "123 Rue de la Paix, 75000 Paris",
    consultationType: "30min" as const,
    reservationDate: "2026-03-15",
    startTime: "14:00",
    endTime: "14:30",
    wantsUpdates: 1,
    acceptedTerms: 1,
    emailSent: 0,
    smsSent: 0,
    paymentStatus: "pending" as const,
    paymentAmount: 3000,
  };

  let reservationId: number;

  describe("Create Reservation", () => {
    it("should create a new reservation", async () => {
      const result = await createReservationV2(testReservation);
      expect(result).toBeDefined();
      expect(result.insertId).toBeGreaterThan(0);
      reservationId = result.insertId;
    });

    it("should retrieve the created reservation", async () => {
      const allReservations = await getAllReservations();
      const reservation = allReservations.find(r => r.id === reservationId);
      expect(reservation).toBeDefined();
      expect(reservation?.firstName).toBe("Jean");
      expect(reservation?.email).toBe("jean.dupont@example.com");
      expect(reservation?.paymentStatus).toBe("pending");
    });
  });

  describe("Time Slot Availability", () => {
    it("should detect conflict with existing reservation", async () => {
      const isAvailable = await isTimeSlotAvailable("2026-03-15", "14:00", "14:30");
      expect(isAvailable).toBe(false);
    });

    it("should allow different time slot on same day", async () => {
      const isAvailable = await isTimeSlotAvailable("2026-03-15", "15:00", "15:30");
      expect(isAvailable).toBe(true);
    });

    it("should allow same time on different day", async () => {
      const isAvailable = await isTimeSlotAvailable("2026-03-16", "14:00", "14:30");
      expect(isAvailable).toBe(true);
    });
  });

  describe("Block Time Slots", () => {
    let blockedSlotId: number;

    it("should create a blocked time slot", async () => {
      const result = await createBlockedTimeSlot({
        date: "2026-03-20",
        startTime: "10:00",
        endTime: "12:00",
        reason: "Maintenance",
      });
      expect(result).toBeDefined();
      blockedSlotId = result.insertId;
    });

    it("should prevent booking during blocked time", async () => {
      const isAvailable = await isTimeSlotAvailable("2026-03-20", "10:30", "11:00");
      expect(isAvailable).toBe(false);
    });

    it("should delete blocked time slot", async () => {
      const result = await deleteBlockedTimeSlot(blockedSlotId);
      expect(result).toBeDefined();
    });

    it("should allow booking after unblocking", async () => {
      const isAvailable = await isTimeSlotAvailable("2026-03-20", "10:30", "11:00");
      expect(isAvailable).toBe(true);
    });
  });

  describe("Update Reservation", () => {
    it("should update reservation details", async () => {
      const success = await updateReservation(reservationId, {
        firstName: "Jean-Pierre",
        phone: "06 98 76 54 32",
      });
      expect(success).toBe(true);
    });

    it("should reflect updates in retrieved reservation", async () => {
      const allReservations = await getAllReservations();
      const reservation = allReservations.find(r => r.id === reservationId);
      expect(reservation?.firstName).toBe("Jean-Pierre");
      expect(reservation?.phone).toBe("06 98 76 54 32");
    });

    it("should update payment status", async () => {
      const success = await updateReservation(reservationId, {
        paymentStatus: "completed",
      });
      expect(success).toBe(true);
    });
  });

  describe("Search Reservations", () => {
    it("should find reservation by email", async () => {
      const results = await searchReservationsByEmail("jean.dupont@example.com");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].email).toContain("jean.dupont");
    });

    it("should find reservation by partial email", async () => {
      const results = await searchReservationsByEmail("dupont");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should return empty array for non-existent email", async () => {
      const results = await searchReservationsByEmail("nonexistent@example.com");
      expect(results.length).toBe(0);
    });
  });

  describe("Cancel Reservation", () => {
    it("should cancel a reservation", async () => {
      const success = await cancelReservation(reservationId, "Client request");
      expect(success).toBe(true);
    });

    it("should not find cancelled reservation", async () => {
      const allReservations = await getAllReservations();
      const reservation = allReservations.find(r => r.id === reservationId);
      expect(reservation).toBeUndefined();
    });
  });

  describe("Get All Reservations", () => {
    it("should retrieve all reservations", async () => {
      const allReservations = await getAllReservations();
      expect(Array.isArray(allReservations)).toBe(true);
    });
  });
});

describe("Reservation Validation", () => {
  it("should validate email format", () => {
    const validEmails = [
      "test@example.com",
      "user+tag@domain.co.uk",
      "name.surname@company.org",
    ];

    const invalidEmails = [
      "notanemail",
      "@example.com",
      "user@",
      "user @example.com",
    ];

    validEmails.forEach((email) => {
      expect(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)).toBe(true);
    });

    invalidEmails.forEach((email) => {
      expect(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)).toBe(false);
    });
  });

  it("should validate phone format", () => {
    const validPhones = [
      "06 12 34 56 78",
      "07-98-76-54-32",
      "+33 6 12 34 56 78",
      "0612345678",
      "+33612345678",
    ];

    const invalidPhones = [
      "123",
      "06 123",
      "invalid phone",
      "+1 555 1234",
    ];

    validPhones.forEach((phone) => {
      const cleanPhone = phone.replace(/[\s.-]/g, "");
      expect(/^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/.test(cleanPhone)).toBe(true);
    });

    invalidPhones.forEach((phone) => {
      const cleanPhone = phone.replace(/[\s.-]/g, "");
      expect(/^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/.test(cleanPhone)).toBe(false);
    });
  });

  it("should validate address length", () => {
    const validAddresses = [
      "123 Rue de la Paix, 75000 Paris",
      "Apartment 5, 456 Avenue des Champs, 69000 Lyon",
      "Villa Soleil, 789 Boulevard de la Mer, 13000 Marseille",
    ];

    const invalidAddresses = [
      "123 Rue",
      "Short St",
      "123",
    ];

    validAddresses.forEach((address) => {
      expect(address.length >= 10).toBe(true);
    });

    invalidAddresses.forEach((address) => {
      expect(address.length >= 10).toBe(false);
    });
  });
});
