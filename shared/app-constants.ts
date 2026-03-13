/**
 * Constantes centralisées de l'application
 * Source unique de vérité pour les configurations
 */

// Types de consultation
export const CONSULTATION_TYPES = {
  '25min': {
    label: '25 minutes',
    price: 25,
    duration: 25,
  },
  '30min': {
    label: '30 minutes',
    price: 30,
    duration: 30,
  },
  '40min': {
    label: '40 minutes',
    price: 40,
    duration: 40,
  },
  '1hour': {
    label: '1 heure',
    price: 50,
    duration: 60,
  },
} as const;

export type ConsultationType = keyof typeof CONSULTATION_TYPES;

// Statuts de réservation
export const RESERVATION_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Statuts de paiement
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Statuts de témoignage
export const TESTIMONIAL_STATUSES = {
  PENDING: 'pending',
  PUBLISHED: 'published',
  PRIVATE: 'private',
  REJECTED: 'rejected',
} as const;

// Limites de validation
export const VALIDATION_LIMITS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_ADDRESS_LENGTH: 10,
  MAX_ADDRESS_LENGTH: 255,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 20,
  MAX_EMAIL_LENGTH: 255,
  MIN_TESTIMONIAL_LENGTH: 20,
  MAX_TESTIMONIAL_LENGTH: 1000,
  MIN_EVENT_TITLE_LENGTH: 5,
  MAX_EVENT_TITLE_LENGTH: 255,
  MIN_EVENT_DESCRIPTION_LENGTH: 20,
  MAX_EVENT_DESCRIPTION_LENGTH: 2000,
  MAX_PLACES_PER_RESERVATION: 10,
} as const;

// Horaires par défaut
export const DEFAULT_HOURS = {
  OPENING_TIME: '09:00',
  CLOSING_TIME: '19:00',
  SLOT_DURATION_MINUTES: 30,
  MIN_ADVANCE_BOOKING_HOURS: 24,
} as const;

// Emails
export const EMAIL_CONFIG = {
  FROM_NAME: 'Maelle Mars',
  FROM_EMAIL: 'noreply@maellemars.com',
  ADMIN_EMAIL: 'maelle-mars@gmail.com',
  SUPPORT_EMAIL: 'support@maellemars.com',
} as const;

// URLs
export const APP_URLS = {
  HOME: '/',
  BOOKING: '/booking',
  EVENTS: '/events',
  EVENTS_LISTING: '/events-listing',
  TESTIMONIALS: '/testimonials',
  SUBMIT_TESTIMONIAL: '/submit-testimonial',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_TESTIMONIALS: '/admin/testimonials',
  CONTACT: '/contact',
} as const;

// Timeouts
export const TIMEOUTS = {
  EMAIL_SEND_TIMEOUT_MS: 30000,
  SMS_SEND_TIMEOUT_MS: 30000,
  API_REQUEST_TIMEOUT_MS: 30000,
  DATABASE_QUERY_TIMEOUT_MS: 30000,
} as const;

// Cache TTL (Time To Live)
export const CACHE_TTL = {
  UPCOMING_EVENTS_MINUTES: 5,
  PUBLISHED_TESTIMONIALS_MINUTES: 10,
  USER_PROFILE_MINUTES: 60,
} as const;

// Rate limiting
export const RATE_LIMITS = {
  RESERVATIONS_PER_HOUR: 100,
  TESTIMONIALS_PER_DAY: 50,
  CONTACT_FORM_PER_HOUR: 20,
  API_REQUESTS_PER_MINUTE: 1000,
} as const;

// Messages d'erreur courants
export const ERROR_MESSAGES = {
  INVALID_EMAIL: "L'adresse email est invalide",
  INVALID_PHONE: "Le numéro de téléphone est invalide",
  INVALID_ADDRESS: "L'adresse est invalide",
  RESERVATION_FAILED: "La réservation a échoué. Veuillez réessayer.",
  PAYMENT_FAILED: "Le paiement a échoué. Veuillez réessayer.",
  EMAIL_SEND_FAILED: "Impossible d'envoyer l'email. Veuillez réessayer.",
  SMS_SEND_FAILED: "Impossible d'envoyer le SMS. Veuillez réessayer.",
  UNAUTHORIZED: "Vous n'êtes pas autorisé à accéder à cette ressource",
  NOT_FOUND: "La ressource demandée n'a pas été trouvée",
  SERVER_ERROR: "Une erreur serveur s'est produite. Veuillez réessayer.",
} as const;

// Messages de succès
export const SUCCESS_MESSAGES = {
  RESERVATION_CREATED: "Votre réservation a été créée avec succès",
  PAYMENT_COMPLETED: "Le paiement a été complété avec succès",
  TESTIMONIAL_SUBMITTED: "Votre témoignage a été soumis avec succès",
  EMAIL_SENT: "L'email a été envoyé avec succès",
  PROFILE_UPDATED: "Votre profil a été mis à jour avec succès",
} as const;

// Regex patterns
export const REGEX_PATTERNS = {
  PHONE: /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  POSTAL_CODE: /^\d{5}$/,
  URL: /^https?:\/\/.+/,
} as const;
