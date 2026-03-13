import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Schéma de validation identique à celui du router
const reservationInputSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide").refine(
    (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    "Format d'email invalide"
  ),
  phone: z.string().refine(
    (phone) => {
      const cleanPhone = phone.replace(/[\s.-]/g, '');
      return /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/.test(cleanPhone);
    },
    "Téléphone invalide (ex: 06 12 34 56 78 ou +33 6 12 34 56 78)"
  ),
  address: z.string().min(10, "L'adresse doit contenir au moins 10 caractères"),
  consultationType: z.enum(["25min", "30min", "40min", "1hour"]),
  selectedTime: z.string().min(1),
  wantsUpdates: z.boolean(),
  acceptedTerms: z.boolean(),
});

describe('Reservation Form Validation', () => {
  describe('Prénom validation', () => {
    it('should reject empty firstName', () => {
      const result = reservationInputSchema.safeParse({
        firstName: '',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '0612345678',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('should reject firstName with only 1 character', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'A',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '0612345678',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid firstName', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '0612345678',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Email validation', () => {
    it('should reject invalid email without @', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'testexample.com',
        phone: '0612345678',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('should reject email with only @', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@',
        phone: '0612345678',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('should reject email without domain extension', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example',
        phone: '0612345678',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid email', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '0612345678',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Phone validation', () => {
    it('should reject phone with only "6"', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '6',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid French phone with spaces', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '07 12 34 56 78',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid French phone without spaces', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '0712345678',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid French phone with +33', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '+33 7 12 34 56 78',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid French phone with 00 33', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '00 33 7 12 34 56 78',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it('should reject phone with invalid format', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '0012345678',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('should reject phone that is too short', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '0612345',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Address validation', () => {
    it('should reject address with less than 10 characters', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '0612345678',
        address: 'Short',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('should reject address with exactly 9 characters', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '0612345678',
        address: '123 Rue',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid address with 10+ characters', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'test@example.com',
        phone: '0612345678',
        address: '123 Rue de la Paix, Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Complete form validation', () => {
    it('should accept a completely valid form', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
                phone: '07 12 34 56 78',
        address: '123 Rue de la Paix, 75000 Paris',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: true,
        acceptedTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it('should reject form with multiple invalid fields', () => {
      const result = reservationInputSchema.safeParse({
        firstName: 'A',
        lastName: 'D',
        email: 'invalid-email',
        phone: '123',
        address: 'Short',
        consultationType: '30min',
        selectedTime: '10:00',
        wantsUpdates: false,
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
    });
  });
});
