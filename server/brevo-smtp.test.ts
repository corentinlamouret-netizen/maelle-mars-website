import { describe, it, expect, vi } from "vitest";
import nodemailer from "nodemailer";

/**
 * Test de validation de la configuration SMTP Brevo
 * Note : La connexion réseau directe au port 587 est bloquée dans l'environnement sandbox.
 * Ces tests valident la configuration et la structure du transporteur sans connexion réseau.
 */
describe("Brevo SMTP Configuration", () => {
  it("should have all required SMTP environment variables set", () => {
    expect(process.env.SMTP_HOST).toBe("smtp-relay.brevo.com");
    expect(process.env.SMTP_PORT).toBe("587");
    expect(process.env.SMTP_USER).toBeTruthy();
    expect(process.env.SMTP_PASSWORD).toBeTruthy();
    expect(process.env.SMTP_FROM).toBeTruthy();
    expect(process.env.MAELLE_EMAIL).toBe("maellemarsmedium@gmail.com");
  });

  it("should have SMTP_USER matching Brevo login format", () => {
    const smtpUser = process.env.SMTP_USER || "";
    // Brevo SMTP login ends with @smtp-brevo.com
    expect(smtpUser).toContain("smtp-brevo.com");
  });

  it("should have SMTP_PASSWORD matching Brevo key format (xsmtpsib-...)", () => {
    const smtpPassword = process.env.SMTP_PASSWORD || "";
    expect(smtpPassword.startsWith("xsmtpsib-")).toBe(true);
    // Brevo keys are long (>50 chars)
    expect(smtpPassword.length).toBeGreaterThan(50);
  });

  it("should create a valid nodemailer transporter with Brevo credentials", () => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    expect(transporter).toBeDefined();
    expect(typeof transporter.sendMail).toBe("function");
  });

  it("should build a valid email options object for client confirmation", () => {
    const emailOptions = {
      from: process.env.SMTP_FROM,
      to: "client@example.com",
      subject: "Confirmation de votre réservation avec Maelle Mars",
      html: "<p>Bonjour,</p><p>Votre réservation est confirmée.</p>",
    };

    expect(emailOptions.from).toContain("maellemarsmedium@gmail.com");
    expect(emailOptions.subject).toContain("Maelle Mars");
    expect(emailOptions.html).toBeTruthy();
  });

  it("should build a valid email options object for Maelle notification", () => {
    const emailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.MAELLE_EMAIL,
      subject: "Nouvelle réservation de consultation",
      html: "<p>Nouvelle réservation reçue.</p>",
    };

    expect(emailOptions.to).toBe("maellemarsmedium@gmail.com");
    expect(emailOptions.subject).toContain("réservation");
  });
});
