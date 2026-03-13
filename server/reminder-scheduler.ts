import cron from "node-cron";
import { sendConsultationReminderToMaelle } from "./notification-service";
import { getAllReservations } from "./db";

/**
 * Service de planification des rappels de consultation
 * Vérifie toutes les minutes les consultations prévues dans 1 heure
 */

interface ScheduledReminder {
  reservationId: number;
  clientFirstName: string;
  consultationType: string;
  selectedTime: string;
  clientPhone: string;
  maelleEmail: string;
  reminderSentAt?: Date;
}

// Stockage des rappels déjà envoyés pour éviter les doublons
const sentReminders = new Set<number>();

/**
 * Démarre le scheduler de rappels
 * S'exécute toutes les minutes pour vérifier les consultations
 */
export function startReminderScheduler(): void {
  console.log("[Reminder Scheduler] Démarrage du scheduler de rappels...");

  // Exécute toutes les minutes (à la 30ème seconde)
  cron.schedule("30 * * * * *", async () => {
    try {
      await checkAndSendReminders();
    } catch (error) {
      console.error("[Reminder Scheduler] Erreur lors de la vérification des rappels :", error);
    }
  });

  console.log("[Reminder Scheduler] Scheduler de rappels démarré avec succès");
}

/**
 * Vérifie les consultations prévues dans 1 heure et envoie les rappels
 */
async function checkAndSendReminders(): Promise<void> {
  try {
    const reservations = await getAllReservations();

    if (!Array.isArray(reservations) || reservations.length === 0) {
      return;
    }

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    for (const reservation of reservations) {
      // Vérifier si le rappel a déjà été envoyé
      if (sentReminders.has(reservation.id)) {
        continue;
      }

      // Parser la date/heure de la consultation
      // ReservationsV2 utilise reservationDate et startTime
      const reservationDate = (reservation as any).reservationDate || "";
      const startTime = (reservation as any).startTime || "";
      const selectedTime = (reservation as any).selectedTime || "";
      
      let consultationTime: Date | null = null;
      let displayTime = "";
      
      if (reservationDate && startTime) {
        // Format V2: date + time
        consultationTime = new Date(`${reservationDate}T${startTime}:00`);
        displayTime = `${reservationDate} ${startTime}`;
      } else if (selectedTime) {
        // Format V1: selectedTime
        consultationTime = parseConsultationTime(selectedTime);
        displayTime = selectedTime;
      }

      if (!consultationTime || isNaN(consultationTime.getTime())) {
        continue;
      }

      // Vérifier si la consultation est dans environ 1 heure (avec une tolérance de 5 minutes)
      const timeDiffMs = consultationTime.getTime() - now.getTime();
      const timeDiffMinutes = timeDiffMs / (1000 * 60);

      // Envoyer le rappel si la consultation est entre 55 et 65 minutes dans le futur
      if (timeDiffMinutes >= 55 && timeDiffMinutes <= 65) {
        console.log(
          `[Reminder Scheduler] Envoi du rappel pour ${reservation.firstName} (consultation à ${displayTime})`
        );

        await sendConsultationReminderToMaelle(
          reservation.consultationType,
          displayTime,
          reservation.firstName,
          reservation.phone,
          process.env.MAELLE_EMAIL || "maellemarsmedium@gmail.com"
        );

        // Marquer le rappel comme envoyé
        sentReminders.add(reservation.id);
        
        console.log(`[Reminder Scheduler] Rappel marqué comme envoyé pour la réservation ${reservation.id}`);

        // Nettoyer les anciens rappels après 24h
        if (sentReminders.size > 1000) {
          sentReminders.clear();
        }
      }
    }
  } catch (error) {
    console.error("[Reminder Scheduler] Erreur lors de la vérification des rappels :", error);
  }
}

/**
 * Parse la chaîne de consultation pour obtenir une Date
 * Supporte les formats :
 * - "2026-03-15 14:30"
 * - "14:30 - 15:00"
 * - "Samedi 15 mars 2026 à 14:30"
 */
function parseConsultationTime(selectedTime: string): Date | null {
  try {
    // Format: "2026-03-15 14:30"
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(selectedTime)) {
      return new Date(selectedTime);
    }

    // Format: "14:30 - 15:00" (assume today or tomorrow)
    if (/^\d{2}:\d{2}/.test(selectedTime)) {
      const timeMatch = selectedTime.match(/^(\d{2}):(\d{2})/);
      if (timeMatch) {
        const [, hours, minutes] = timeMatch;
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Si l'heure est dans le passé, utiliser demain
        if (date < new Date()) {
          date.setDate(date.getDate() + 1);
        }

        return date;
      }
    }

    // Format: "Samedi 15 mars 2026 à 14:30" ou similaire
    // Essayer de parser avec Date.parse
    const parsed = new Date(selectedTime);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }

    return null;
  } catch (error) {
    console.error(`[Reminder Scheduler] Erreur lors du parsing de "${selectedTime}":`, error);
    return null;
  }
}

/**
 * Arrête le scheduler de rappels
 */
export function stopReminderScheduler(): void {
  cron.getTasks().forEach((task) => {
    task.stop();
  });
  console.log("[Reminder Scheduler] Scheduler de rappels arrêté");
}
