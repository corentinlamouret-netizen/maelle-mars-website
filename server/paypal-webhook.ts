import { sendEmail, generateClientConfirmationEmail, generateMaelleNotificationEmail } from "./mailer";
import { getAllReservations, updatePaymentStatus, getPaymentByTransactionId } from "./db";

/**
 * PayPal Webhook Handler
 * Processes webhook events from PayPal to update payment status and create reservations
 */

interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource: {
    id: string;
    state?: string;
    status?: string;
    custom_id?: string;
    payer?: {
      email_address?: string;
      name?: {
        given_name?: string;
        surname?: string;
      };
    };
    amount_paid?: {
      value?: string;
      currency_code?: string;
    };
  };
  create_time: string;
}

/**
 * Handle PayPal webhook events
 * Supports: CHECKOUT.ORDER.APPROVED, PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED
 */
export async function handlePayPalWebhook(event: PayPalWebhookEvent): Promise<void> {
  console.log("[PayPal Webhook] Received event:", event.event_type);

  try {
    switch (event.event_type) {
      case "CHECKOUT.ORDER.APPROVED":
        await handleOrderApproved(event);
        break;

      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePaymentCompleted(event);
        break;

      case "PAYMENT.CAPTURE.DENIED":
      case "PAYMENT.CAPTURE.REFUNDED":
        await handlePaymentFailed(event);
        break;

      default:
        console.log("[PayPal Webhook] Unhandled event type:", event.event_type);
    }
  } catch (error) {
    console.error("[PayPal Webhook] Error processing webhook:", error);
    throw error;
  }
}

/**
 * Handle CHECKOUT.ORDER.APPROVED event
 * This event is triggered when a customer approves the payment on PayPal
 */
async function handleOrderApproved(event: PayPalWebhookEvent): Promise<void> {
  const transactionId = event.resource.id;
  const customId = event.resource.custom_id; // This should contain our reservationId

  console.log("[PayPal Webhook] Order approved:", transactionId);

  if (!customId) {
    console.warn("[PayPal Webhook] No custom_id found in webhook, cannot link to reservation");
    return;
  }

  try {
    // Get the reservation to send confirmation emails
    const reservationId = parseInt(customId, 10);
      const allReservations = await getAllReservations();
      const reservation = allReservations.find(r => r.id === reservationId);

      if (reservation) {
        // Send confirmation email to client
        const selectedTime = `${reservation.reservationDate} ${reservation.startTime} - ${reservation.endTime}`;
        const clientEmail = generateClientConfirmationEmail(
          reservation.firstName,
          reservation.consultationType,
          selectedTime
        );

        await sendEmail({
          to: reservation.email,
          subject: "Confirmation de votre réservation - Maelle Mars",
          html: clientEmail,
        });

        // Send notification email to Maelle
        const maelleEmail = generateMaelleNotificationEmail(
          reservation.firstName,
          reservation.lastName,
          reservation.consultationType,
          selectedTime
        );

        await sendEmail({
          to: process.env.MAELLE_EMAIL || "maellemars@gmail.com",
          subject: `Nouvelle réservation confirmée - ${reservation.firstName} ${reservation.lastName}`,
          html: maelleEmail,
        });

        console.log("[PayPal Webhook] Successfully processed payment for reservation:", reservationId);
      } else {
        console.warn("[PayPal Webhook] Reservation not found:", reservationId);
      }
  } catch (error) {
    console.error("[PayPal Webhook] Error handling order approved:", error);
    throw error;
  }
}

/**
 * Handle PAYMENT.CAPTURE.COMPLETED event
 * This event is triggered when PayPal successfully captures the payment
 */
async function handlePaymentCompleted(event: PayPalWebhookEvent): Promise<void> {
  const transactionId = event.resource.id;
  const customId = event.resource.custom_id;

  console.log("[PayPal Webhook] Payment completed:", transactionId);

  if (!customId) {
    console.warn("[PayPal Webhook] No custom_id found in webhook");
    return;
  }

  try {
    // Update payment status
    const payment = await getPaymentByTransactionId(transactionId);
    if (payment) {
      await updatePaymentStatus(payment.id, "completed");
    }
    console.log("[PayPal Webhook] Payment confirmed for transaction:", transactionId);
  } catch (error) {
    console.error("[PayPal Webhook] Error handling payment completed:", error);
    throw error;
  }
}

/**
 * Handle payment failure events
 */
async function handlePaymentFailed(event: PayPalWebhookEvent): Promise<void> {
  const transactionId = event.resource.id;
  const customId = event.resource.custom_id;

  console.log("[PayPal Webhook] Payment failed:", transactionId);

  if (!customId) {
    console.warn("[PayPal Webhook] No custom_id found in webhook");
    return;
  }

  try {
    // Update payment status to failed
    const payment = await getPaymentByTransactionId(transactionId);
    if (payment) {
      await updatePaymentStatus(payment.id, "failed");
    }

    if (customId) {
      const reservationId = parseInt(customId, 10);
      const allReservations = await getAllReservations();
      const reservation = allReservations.find(r => r.id === reservationId);

      if (reservation) {
        // Send failure notification to client
        const failureEmail = `
          <h2>Paiement échoué</h2>
          <p>Bonjour ${reservation.firstName},</p>
          <p>Malheureusement, votre paiement pour la consultation du ${reservation.reservationDate} à ${reservation.startTime} a échoué.</p>
          <p>Veuillez réessayer ou nous contacter pour plus d'informations.</p>
        `;

        await sendEmail({
          to: reservation.email,
          subject: "Paiement échoué - Maelle Mars",
          html: failureEmail,
        });

        console.log("[PayPal Webhook] Payment failure processed for reservation:", reservationId);
      }
    }
  } catch (error) {
    console.error("[PayPal Webhook] Error handling payment failed:", error);
    throw error;
  }
}

/**
 * Verify PayPal webhook signature (for production)
 * This should be implemented with PayPal's webhook signature verification
 */
export async function verifyPayPalWebhookSignature(
  webhookId: string,
  eventBody: string,
  headers: Record<string, string>
): Promise<boolean> {
  // In production, verify the webhook signature with PayPal
  // For now, return true (should be implemented with PayPal SDK)
  console.log("[PayPal Webhook] Signature verification skipped (implement in production)");
  return true;
}
