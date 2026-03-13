import { sendEmail, generateClientConfirmationEmail, generateMaelleNotificationEmail } from "./mailer";
import { generateMaelleReminderEmailTemplate } from "./email-templates";

/**
 * Service de notifications centralisé
 * Élimine la duplication et centralise la logique d'envoi
 */

export interface ReservationNotificationData {
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  consultationType: string;
  selectedTime: string;
  maelleEmail: string;
}

export interface EventReservationNotificationData {
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  numberOfPlaces: number;
  totalPrice: number;
  maelleEmail: string;
}

/**
 * Envoie les notifications de confirmation de réservation de consultation (e-mail uniquement)
 */
export async function notifyReservationConfirmed(
  data: ReservationNotificationData
): Promise<void> {
  try {
    // Générer les contenus
    const clientEmailHtml = generateClientConfirmationEmail(
      data.clientFirstName,
      data.consultationType,
      data.selectedTime
    );

    const maelleEmailHtml = generateMaelleNotificationEmail(
      data.clientFirstName,
      data.clientLastName,
      data.consultationType,
      data.selectedTime
    );

    await Promise.all([
      sendEmail({
        to: data.clientEmail,
        subject: "Confirmation de votre réservation avec Maelle Mars",
        html: clientEmailHtml,
      }),
      sendEmail({
        to: data.maelleEmail,
        subject: "Nouvelle réservation de consultation",
        html: maelleEmailHtml,
      }),
    ]);

    console.log(`✅ Notifications e-mail envoyées pour la réservation de ${data.clientFirstName}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi des notifications :", error);
    throw new Error("Impossible d'envoyer les notifications de confirmation");
  }
}

/**
 * Envoie les notifications de confirmation de réservation d'événement
 */
export async function notifyEventReservationConfirmed(
  data: EventReservationNotificationData
): Promise<void> {
  try {
    const clientEmailHtml = `
      <h2>Confirmation de votre réservation pour l'événement</h2>
      <p>Bonjour ${data.clientFirstName},</p>
      <p>Votre réservation pour l'événement <strong>${data.eventTitle}</strong> a été confirmée.</p>
      <ul>
        <li><strong>Date :</strong> ${data.eventDate}</li>
        <li><strong>Lieu :</strong> ${data.eventLocation}</li>
        <li><strong>Nombre de places :</strong> ${data.numberOfPlaces}</li>
        <li><strong>Montant :</strong> ${data.totalPrice}€</li>
      </ul>
      <p>À bientôt !</p>
    `;

    const maelleEmailHtml = `
      <h2>Nouvelle réservation pour l'événement</h2>
      <p><strong>${data.clientFirstName} ${data.clientLastName}</strong> a réservé pour :</p>
      <ul>
        <li><strong>Événement :</strong> ${data.eventTitle}</li>
        <li><strong>Nombre de places :</strong> ${data.numberOfPlaces}</li>
        <li><strong>Montant :</strong> ${data.totalPrice}€</li>
        <li><strong>Email :</strong> ${data.clientEmail}</li>
        <li><strong>Téléphone :</strong> ${data.clientPhone}</li>
      </ul>
    `;

    await Promise.all([
      sendEmail({
        to: data.clientEmail,
        subject: `Confirmation de réservation - ${data.eventTitle}`,
        html: clientEmailHtml,
      }),
      sendEmail({
        to: data.maelleEmail,
        subject: `Nouvelle réservation pour ${data.eventTitle}`,
        html: maelleEmailHtml,
      }),
    ]);

    console.log(`✅ Notifications d'événement envoyées pour ${data.clientFirstName}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi des notifications d'événement :", error);
    throw new Error("Impossible d'envoyer les notifications de confirmation");
  }
}

/**
 * Envoie une notification de rappel 24h avant un événement
 */
export async function sendEventReminderNotification(
  clientEmail: string,
  eventTitle: string,
  eventDate: string
): Promise<void> {
  try {
    const emailHtml = `
      <h2>Rappel : Événement demain</h2>
      <p>Bonjour,</p>
      <p>Nous vous rappelons que l'événement <strong>${eventTitle}</strong> aura lieu demain à ${eventDate}.</p>
      <p>À bientôt !</p>
    `;

    await sendEmail({
      to: clientEmail,
      subject: `Rappel : ${eventTitle} demain`,
      html: emailHtml,
    });

    console.log(`✅ Rappel envoyé pour ${eventTitle}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du rappel :", error);
    // Ne pas lever d'erreur pour les rappels (non-critique)
  }
}

/**
 * Envoie une notification de témoignage publié
 */
export async function notifyTestimonialPublished(
  clientEmail: string,
  clientName: string
): Promise<void> {
  try {
    const emailHtml = `
      <h2>Votre témoignage a été publié</h2>
      <p>Bonjour ${clientName},</p>
      <p>Merci pour votre témoignage ! Il a été examiné et publié sur notre site.</p>
      <p>Vous pouvez le consulter sur notre page de témoignages.</p>
      <p>Cordialement,<br>Maelle Mars</p>
    `;

    await sendEmail({
      to: clientEmail,
      subject: "Votre témoignage a été publié",
      html: emailHtml,
    });

    console.log(`✅ Notification de publication envoyée à ${clientName}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de la notification :", error);
    // Ne pas lever d'erreur (non-critique)
  }
}

/**
 * Envoie un rappel 1h avant la consultation à Maelle
 */
export async function sendConsultationReminderToMaelle(
  consultationType: string,
  selectedTime: string,
  clientFirstName: string,
  clientPhone: string,
  maelleEmail: string
): Promise<void> {
  try {
    const emailHtml = generateMaelleReminderEmailTemplate(
      clientFirstName,
      consultationType,
      selectedTime,
      clientPhone
    );

    await sendEmail({
      to: maelleEmail,
      subject: "Rappel : Consultation dans 1 heure",
      html: emailHtml,
    });

    console.log(`✅ Rappel de consultation envoyé à Maelle pour ${clientFirstName}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du rappel de consultation :", error);
    // Ne pas lever d'erreur pour les rappels (non-critique)
  }
}

/**
 * Envoie une notification de contact reçu
 */
export async function notifyContactFormSubmitted(
  name: string,
  email: string,
  message: string,
  maelleEmail: string
): Promise<void> {
  try {
    const emailHtml = `
      <h2>Nouveau message de contact</h2>
      <p><strong>De :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Message :</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    await sendEmail({
      to: maelleEmail,
      subject: `Nouveau message de contact de ${name}`,
      html: emailHtml,
    });

    console.log(`✅ Message de contact reçu de ${name}`);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message :", error);
    throw new Error("Impossible d'envoyer le message");
  }
}
