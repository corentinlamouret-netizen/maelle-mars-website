import nodemailer from "nodemailer";
import { generateClientConfirmationEmailTemplate, generateMaelleNotificationEmailTemplate } from "./email-templates";

// Configuration Nodemailer
// Utilise les variables d'environnement SMTP si disponibles, sinon utilise Ethereal (sandbox)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER || process.env.ETHEREAL_EMAIL || "test@ethereal.email",
    pass: process.env.SMTP_PASSWORD || process.env.ETHEREAL_PASSWORD || "test",
  },
});

const fromEmail = process.env.SMTP_FROM || "Maelle Mars <noreply@maelle-mars.com>";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });

    console.log("[Email] Sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}

export function generateClientConfirmationEmail(
  firstName: string,
  consultationType: string,
  selectedTime: string
): string {
  return generateClientConfirmationEmailTemplate(firstName, consultationType, selectedTime);
}

// Legacy function for backward compatibility
export function generateClientConfirmationEmailLegacy(
  firstName: string,
  consultationType: string,
  selectedTime: string
): string {
  const consultationLabel = {
    question: "Question oui/non",
    "30min": "Consultation de 30 minutes",
    "1hour": "Consultation d'1 heure",
  }[consultationType] || consultationType;

  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d4a574;">Confirmation de votre réservation</h2>
          <p>Bonjour ${firstName},</p>
          <p>Nous vous confirmons votre rendez-vous avec Maelle Mars à la date <strong>${selectedTime}</strong>.</p>
          <p><strong>Type de consultation :</strong> ${consultationLabel}</p>
          <p style="color: #d4a574; font-weight: bold;">
            ⚠️ Nous vous rappelons que c'est à vous d'appeler Maelle Mars à la date convenue.
          </p>
          <p style="color: #d4a574;">
            <strong>Numéro de téléphone :</strong> 06 46 22 66 10
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">
            Merci pour votre confiance. À bientôt !<br>
            Maelle Mars - Médium & Clairvoyante
          </p>
        </div>
      </body>
    </html>
  `;
}

export function generateMaelleNotificationEmail(
  clientFirstName: string,
  clientLastName: string,
  consultationType: string,
  selectedTime: string,
  email?: string,
  phone?: string,
  address?: string
): string {
  return generateMaelleNotificationEmailTemplate(
    clientFirstName,
    clientLastName,
    consultationType,
    selectedTime,
    email,
    phone,
    address
  );
}

// Legacy function for backward compatibility
export function generateMaelleNotificationEmailLegacy(
  clientFirstName: string,
  clientLastName: string,
  consultationType: string,
  selectedTime: string
): string {
  const consultationLabel = {
    question: "Question oui/non",
    "30min": "Consultation de 30 minutes",
    "1hour": "Consultation d'1 heure",
  }[consultationType] || consultationType;

  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d4a574;">Nouvelle réservation</h2>
          <p>Bonjour Mamounette,</p>
          <p>Tu as un rendez-vous programmé avec <strong>${clientFirstName} ${clientLastName}</strong> à la date <strong>${selectedTime}</strong>.</p>
          <p><strong>Type de consultation :</strong> ${consultationLabel}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">
            Cocolyly
          </p>
        </div>
      </body>
    </html>
  `;
}
