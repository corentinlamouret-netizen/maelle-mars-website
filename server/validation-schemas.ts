import { z } from "zod";

/**
 * Constantes de validation réutilisables
 * Centralisées pour éviter la duplication et faciliter la maintenance
 */

// Regex patterns
export const PHONE_REGEX = /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Schémas de validation réutilisables
export const phoneSchema = z.string()
  .min(10, "Téléphone trop court")
  .max(20, "Téléphone trop long")
  .refine(
    (phone) => {
      const cleanPhone = phone.replace(/[\s.-]/g, '');
      return PHONE_REGEX.test(cleanPhone);
    },
    "Téléphone invalide (ex: 06 12 34 56 78 ou +33 6 12 34 56 78)"
  )
  .transform((phone) => phone.replace(/[\s.-]/g, '')); // Normaliser

export const emailSchema = z.string()
  .email("Email invalide")
  .max(255, "Email trop long")
  .toLowerCase()
  .refine(
    (email) => EMAIL_REGEX.test(email),
    "Format d'email invalide"
  );

export const nameSchema = z.string()
  .min(2, "Le nom doit contenir au moins 2 caractères")
  .max(100, "Le nom est trop long")
  .trim();

export const addressSchema = z.string()
  .min(10, "L'adresse doit contenir au moins 10 caractères")
  .max(255, "L'adresse est trop longue")
  .trim();

export const postalCodeSchema = z.string()
  .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres");

export const citySchema = z.string()
  .min(2, "La ville doit contenir au moins 2 caractères")
  .max(100, "La ville est trop longue")
  .trim();

export const consultationTypeSchema = z.enum(["25min", "30min", "40min", "1hour"]);

export const ratingSchema = z.number()
  .min(1, "La note doit être au minimum 1")
  .max(5, "La note doit être au maximum 5");

export const testimonialTextSchema = z.string()
  .min(20, "Le témoignage doit contenir au moins 20 caractères")
  .max(1000, "Le témoignage doit contenir au maximum 1000 caractères")
  .trim();

// Schémas composés pour les formulaires complets
export const reservationFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  street: z.string()
    .min(5, "La rue doit contenir au moins 5 caractères")
    .max(255, "La rue est trop longue")
    .trim(),
  postalCode: postalCodeSchema,
  city: citySchema,
  consultationType: consultationTypeSchema,
  selectedTime: z.string().min(1, "Veuillez sélectionner une heure"),
  wantsUpdates: z.boolean().default(false),
  acceptedTerms: z.boolean().refine(
    (val) => val === true,
    "Vous devez accepter les conditions d'utilisation"
  ),
});

export const eventReservationFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  numberOfPlaces: z.number()
    .min(1, "Vous devez réserver au moins 1 place")
    .max(10, "Vous ne pouvez réserver que 10 places maximum"),
  eventId: z.number().positive("ID d'événement invalide"),
});

export const testimonialFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  rating: ratingSchema,
  text: testimonialTextSchema,
});

export const eventFormSchema = z.object({
  title: z.string()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(255, "Le titre est trop long"),
  description: z.string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(2000, "La description est trop longue"),
  startDate: z.string().datetime("Date de début invalide"),
  endDate: z.string().datetime("Date de fin invalide"),
  street: z.string().min(5, "La rue est requise"),
  postalCode: postalCodeSchema,
  city: citySchema,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  availablePlaces: z.number().min(1, "Au moins 1 place doit être disponible"),
  price: z.number().min(0, "Le prix ne peut pas être négatif"),
});

// Types TypeScript dérivés des schémas Zod
export type PhoneInput = z.infer<typeof phoneSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
export type ReservationForm = z.infer<typeof reservationFormSchema>;
export type EventReservationForm = z.infer<typeof eventReservationFormSchema>;
export type TestimonialForm = z.infer<typeof testimonialFormSchema>;
export type EventForm = z.infer<typeof eventFormSchema>;
