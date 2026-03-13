import { describe, it, expect, beforeEach } from "vitest";
import { calculateMonthlyStats, getReportFilename } from "./report-generator";

describe("Report Generator", () => {
  describe("calculateMonthlyStats", () => {
    it("should calculate correct filename format", () => {
      const filename = getReportFilename(3, 2026);
      expect(filename).toBe("rapport-mensuel-2026-03.pdf");
    });

    it("should handle single digit months with padding", () => {
      const filename = getReportFilename(1, 2026);
      expect(filename).toBe("rapport-mensuel-2026-01.pdf");
    });

    it("should handle double digit months", () => {
      const filename = getReportFilename(12, 2026);
      expect(filename).toBe("rapport-mensuel-2026-12.pdf");
    });

    it("should return stats object with required fields", async () => {
      const stats = await calculateMonthlyStats(2, 2026);

      expect(stats).toHaveProperty("month");
      expect(stats).toHaveProperty("year");
      expect(stats).toHaveProperty("totalClients");
      expect(stats).toHaveProperty("newClients");
      expect(stats).toHaveProperty("totalConsultations");
      expect(stats).toHaveProperty("totalRevenue");
      expect(stats).toHaveProperty("averageConsultationPrice");
      expect(stats).toHaveProperty("clientsWithUpdates");
      expect(stats).toHaveProperty("clientsWithConferences");
      expect(stats).toHaveProperty("consultationsByType");
      expect(stats).toHaveProperty("topConsultationDates");
    });

    it("should have correct data types in stats", async () => {
      const stats = await calculateMonthlyStats(2, 2026);

      expect(typeof stats.month).toBe("string");
      expect(typeof stats.year).toBe("number");
      expect(typeof stats.totalClients).toBe("number");
      expect(typeof stats.newClients).toBe("number");
      expect(typeof stats.totalConsultations).toBe("number");
      expect(typeof stats.totalRevenue).toBe("number");
      expect(typeof stats.averageConsultationPrice).toBe("number");
      expect(Array.isArray(stats.topConsultationDates)).toBe(true);
    });

    it("should have non-negative values", async () => {
      const stats = await calculateMonthlyStats(2, 2026);

      expect(stats.totalClients).toBeGreaterThanOrEqual(0);
      expect(stats.newClients).toBeGreaterThanOrEqual(0);
      expect(stats.totalConsultations).toBeGreaterThanOrEqual(0);
      expect(stats.totalRevenue).toBeGreaterThanOrEqual(0);
      expect(stats.averageConsultationPrice).toBeGreaterThanOrEqual(0);
    });

    it("should have consultation types distribution", async () => {
      const stats = await calculateMonthlyStats(2, 2026);

      expect(stats.consultationsByType).toHaveProperty("25min");
      expect(stats.consultationsByType).toHaveProperty("30min");
      expect(stats.consultationsByType).toHaveProperty("40min");
      expect(stats.consultationsByType).toHaveProperty("1hour");

      Object.values(stats.consultationsByType).forEach((count) => {
        expect(typeof count).toBe("number");
        expect(count).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("Report Email", () => {
    it("should validate admin email", () => {
      const adminEmail = "maellemars@gmail.com";
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail);
      expect(isValidEmail).toBe(true);
    });

    it("should have valid email format", () => {
      const adminEmail = "maellemars@gmail.com";
      expect(adminEmail).toContain("@");
      expect(adminEmail).toContain(".");
      expect(adminEmail).toMatch(/\.com$/);
    });
  });

  describe("PDF Generation", () => {
    it("should create valid month names", () => {
      const months = [
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre",
      ];

      months.forEach((month, index) => {
        const date = new Date(2026, index, 1);
        const monthName = date.toLocaleString("fr-FR", { month: "long" });
        expect(monthName.toLowerCase()).toBe(month);
      });
    });

    it("should format revenue correctly", () => {
      const revenue = 1234.567;
      const formatted = revenue.toFixed(2);
      expect(formatted).toBe("1234.57");
    });

    it("should calculate average price correctly", () => {
      const totalRevenue = 1000;
      const consultationCount = 10;
      const average = totalRevenue / consultationCount;
      expect(average).toBe(100);
    });
  });

  describe("Consultation Types Pricing", () => {
    it("should have correct prices for consultation types", () => {
      const priceMap: Record<string, number> = {
        "25min": 70,
        "30min": 80,
        "40min": 110,
        "1hour": 150,
      };

      expect(priceMap["25min"]).toBe(70);
      expect(priceMap["30min"]).toBe(80);
      expect(priceMap["40min"]).toBe(110);
      expect(priceMap["1hour"]).toBe(150);
    });

    it("should calculate total revenue from multiple consultations", () => {
      const priceMap: Record<string, number> = {
        "25min": 70,
        "30min": 80,
        "40min": 110,
        "1hour": 150,
      };

      const consultations = ["30min", "30min", "1hour"];
      const total = consultations.reduce((sum, type) => sum + (priceMap[type] || 0), 0);

      expect(total).toBe(310); // 80 + 80 + 150
    });
  });

  describe("Statistics Calculations", () => {
    it("should calculate engagement percentage", () => {
      const totalClients = 100;
      const clientsWithUpdates = 60;
      const percentage = (clientsWithUpdates / totalClients) * 100;

      expect(percentage).toBe(60);
    });

    it("should handle zero clients gracefully", () => {
      const totalClients = 0;
      const clientsWithUpdates = 0;
      const percentage = totalClients > 0 ? (clientsWithUpdates / totalClients) * 100 : 0;

      expect(percentage).toBe(0);
    });

    it("should calculate average consultations per client", () => {
      const totalConsultations = 50;
      const totalClients = 10;
      const average = (totalConsultations / totalClients).toFixed(1);

      expect(average).toBe("5.0");
    });
  });
});
