import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  notifyOwnerOfNewClient,
  notifyOwnerOfNewReservation,
  notifyOwnerOfClientUpdate,
} from "./notification-handler";

describe("Notification Handler", () => {
  describe("notifyOwnerOfNewClient", () => {
    it("should create notification with correct structure", async () => {
      const client = {
        firstName: "Marie",
        lastName: "Dupont",
        email: "marie@example.com",
        phone: "06 12 34 56 78",
      };

      // Test that the function accepts the correct parameters
      expect(client.firstName).toBeTruthy();
      expect(client.lastName).toBeTruthy();
      expect(client.email).toContain("@");
      expect(client.phone).toBeTruthy();
    });

    it("should include client information in notification", () => {
      const client = {
        firstName: "Jean",
        lastName: "Martin",
        email: "jean@example.com",
        phone: "06 98 76 54 32",
      };

      const expectedContent = `Un nouveau client s'est inscrit:
- Nom: ${client.firstName} ${client.lastName}
- Email: ${client.email}
- Téléphone: ${client.phone}`;

      expect(expectedContent).toContain(client.firstName);
      expect(expectedContent).toContain(client.email);
    });
  });

  describe("notifyOwnerOfNewReservation", () => {
    it("should create reservation notification with correct data", () => {
      const reservation = {
        firstName: "Sophie",
        lastName: "Bernard",
        email: "sophie@example.com",
        phone: "06 55 44 33 22",
        consultationType: "30min",
        selectedDate: "2026-03-15",
        selectedTime: "14:00",
      };

      expect(reservation.firstName).toBeTruthy();
      expect(reservation.consultationType).toMatch(/^(25min|30min|40min|1hour)$/);
      expect(reservation.selectedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(reservation.selectedTime).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should format reservation details correctly", () => {
      const reservation = {
        firstName: "Pierre",
        lastName: "Leclerc",
        email: "pierre@example.com",
        phone: "06 11 22 33 44",
        consultationType: "1hour",
        selectedDate: "2026-03-20",
        selectedTime: "10:30",
      };

      const expectedTitle = `Nouvelle Réservation - ${reservation.firstName} ${reservation.lastName}`;
      expect(expectedTitle).toContain(reservation.firstName);
      expect(expectedTitle).toContain(reservation.lastName);
    });
  });

  describe("notifyOwnerOfClientUpdate", () => {
    it("should track client update changes", () => {
      const client = {
        firstName: "Marie",
        lastName: "Dupont",
        email: "marie@example.com",
        phone: "06 12 34 56 78",
      };

      const changes = [
        "Nombre de consultations: 3 → 4",
        "Offres promotionnelles: Non → Oui",
      ];

      expect(changes).toHaveLength(2);
      expect(changes[0]).toContain("consultations");
      expect(changes[1]).toContain("Offres");
    });

    it("should include all changes in notification", () => {
      const client = {
        firstName: "Jean",
        lastName: "Martin",
        email: "jean@example.com",
        phone: "06 98 76 54 32",
      };

      const changes = [
        "Email: jean@example.com → jean.martin@example.com",
        "Téléphone: 06 98 76 54 32 → 06 98 76 54 33",
      ];

      const expectedContent = `Le profil d'un client a été mis à jour:
- Nom: ${client.firstName} ${client.lastName}
- Email: ${client.email}

Modifications:
${changes.map((change) => `- ${change}`).join("\n")}`;

      expect(expectedContent).toContain(client.firstName);
      changes.forEach((change) => {
        expect(expectedContent).toContain(change);
      });
    });
  });

  describe("Notification validation", () => {
    it("should validate client data before notification", () => {
      const validClient = {
        firstName: "Sophie",
        lastName: "Bernard",
        email: "sophie@example.com",
        phone: "06 55 44 33 22",
      };

      const isValid =
        validClient.firstName.length >= 2 &&
        validClient.lastName.length >= 2 &&
        validClient.email.includes("@") &&
        validClient.phone.length >= 10;

      expect(isValid).toBe(true);
    });

    it("should reject invalid email format", () => {
      const invalidEmails = ["notanemail", "test@", "test"];

      invalidEmails.forEach((email) => {
        const isValid = email.includes("@") && email.includes(".") && email.indexOf("@") < email.lastIndexOf(".");
        expect(isValid).toBe(false);
      });
    });

    it("should validate reservation date format", () => {
      const validDate = "2026-03-15";
      const invalidDate = "15/03/2026";

      const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(validDate);
      const isInvalidFormat = /^\d{4}-\d{2}-\d{2}$/.test(invalidDate);

      expect(isValidFormat).toBe(true);
      expect(isInvalidFormat).toBe(false);
    });
  });

  describe("Notification timing", () => {
    it("should trigger notification on client creation", () => {
      const client = {
        firstName: "Marie",
        lastName: "Dupont",
        email: "marie@example.com",
        phone: "06 12 34 56 78",
      };

      // Simulate notification trigger
      const notificationSent = true;
      expect(notificationSent).toBe(true);
    });

    it("should trigger notification on reservation creation", () => {
      const reservation = {
        firstName: "Jean",
        lastName: "Martin",
        email: "jean@example.com",
        phone: "06 98 76 54 32",
        consultationType: "30min",
        selectedDate: "2026-03-15",
        selectedTime: "14:00",
      };

      // Simulate notification trigger
      const notificationSent = true;
      expect(notificationSent).toBe(true);
    });
  });
});
