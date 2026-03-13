/**
 * Templates d'email professionnels pour Maelle Mars
 */

export function generateClientConfirmationEmailTemplate(
  firstName: string,
  consultationType: string,
  selectedTime: string
): string {
  const consultationLabel = {
    "10min": "Consultation express - 10 minutes",
    "15min": "Consultation express - 15 minutes",
    "25min": "Consultation rapide - 20 minutes",
    "30min": "Consultation standard - 30 minutes",
    "40min": "Consultation approfondie - 45 minutes",
    "1hour": "Consultation premium - 1 heure",
  }[consultationType] || consultationType;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de réservation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2c1b47 0%, #4a2c5e 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #d4a574; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">Maelle Mars</h1>
          <p style="color: #b8956a; margin: 10px 0 0 0; font-size: 14px;">Médium & Clairvoyante</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #2c1b47; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Confirmation de votre réservation</h2>
          
          <p style="color: #555; margin: 0 0 20px 0; line-height: 1.6;">Bonjour <strong>${firstName}</strong>,</p>
          
          <p style="color: #555; margin: 0 0 20px 0; line-height: 1.6;">Votre réservation a été confirmée. Veuillez appeler Maelle Mars à la date et l'heure convenue pour débuter votre consultation.</p>
          
          <!-- Reservation Details -->
          <div style="background-color: #f9f9f9; border-left: 4px solid #d4a574; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #666;">
              <strong style="color: #2c1b47;">Date et heure de votre consultation :</strong><br>
              ${selectedTime}
            </p>
            <p style="margin: 0; color: #666;">
              <strong style="color: #2c1b47;">Type de consultation :</strong><br>
              ${consultationLabel}
            </p>
          </div>
          
          <!-- Important Notice -->
          <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-weight: 500;">
              ⚠️ <strong>Important :</strong> C'est à vous d'appeler Maelle Mars à la date et l'heure convenue pour débuter votre consultation.
            </p>
          </div>
          
          <!-- Contact Info -->
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 4px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Pour toute question :</p>
            <p style="margin: 0; color: #d4a574; font-size: 18px; font-weight: 600;">06 46 22 66 10</p>
          </div>
          
          <p style="color: #555; margin: 20px 0; line-height: 1.6;">Nous vous remercions de votre confiance et nous réjouissons de vous rencontrer.</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #999; font-size: 12px; line-height: 1.6;">
            Maelle Mars - Médium & Clairvoyante<br>
            <a href="https://maelle-mars.com" style="color: #d4a574; text-decoration: none;">www.maelle-mars.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateMaelleNotificationEmailTemplate(
  clientFirstName: string,
  clientLastName: string,
  consultationType: string,
  selectedTime: string,
  email?: string,
  phone?: string,
  address?: string
): string {
  const consultationLabel = {
    "10min": "Consultation express - 10 minutes",
    "15min": "Consultation express - 15 minutes",
    "25min": "Consultation rapide - 20 minutes",
    "30min": "Consultation standard - 30 minutes",
    "40min": "Consultation approfondie - 45 minutes",
    "1hour": "Consultation premium - 1 heure",
  }[consultationType] || consultationType;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle réservation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2c1b47 0%, #4a2c5e 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #d4a574; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">Maelle Mars</h1>
          <p style="color: #b8956a; margin: 10px 0 0 0; font-size: 14px;">Médium & Clairvoyante</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #2c1b47; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Nouvelle réservation</h2>
          
          <p style="color: #555; margin: 0 0 20px 0; line-height: 1.6;">Bonjour Maelle,</p>
          
          <p style="color: #555; margin: 0 0 20px 0; line-height: 1.6;">Vous venez d'avoir une réservation <strong>${consultationLabel}</strong>.</p>
          
          <!-- Reservation Details -->
          <div style="background-color: #f9f9f9; border-left: 4px solid #d4a574; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #666;">
              <strong style="color: #2c1b47;">Client :</strong><br>
              ${clientFirstName} ${clientLastName}
            </p>
            <p style="margin: 0 0 10px 0; color: #666;">
              <strong style="color: #2c1b47;">Heure :</strong><br>
              ${selectedTime}
            </p>
            <p style="margin: 0 0 10px 0; color: #666;">
              <strong style="color: #2c1b47;">Type de consultation :</strong><br>
              ${consultationLabel}
            </p>
            ${phone ? `<p style="margin: 0; color: #666;">
              <strong style="color: #2c1b47;">Le client vous appellera au :</strong><br>
              ${phone}
            </p>` : ""}
          </div>
          
          <p style="color: #555; margin: 20px 0; line-height: 1.6;">Le client vous appellera à l'heure convenue.</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #999; font-size: 12px; line-height: 1.6;">
            Maelle Mars - Médium & Clairvoyante<br>
            Cocolyly
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateMaelleReminderEmailTemplate(
  clientFirstName: string,
  consultationType: string,
  selectedTime: string,
  phone?: string
): string {
  const consultationLabel = {
    "10min": "Consultation express - 10 minutes",
    "15min": "Consultation express - 15 minutes",
    "25min": "Consultation rapide - 20 minutes",
    "30min": "Consultation standard - 30 minutes",
    "40min": "Consultation approfondie - 45 minutes",
    "1hour": "Consultation premium - 1 heure",
  }[consultationType] || consultationType;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rappel de consultation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2c1b47 0%, #4a2c5e 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #d4a574; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">Maelle Mars</h1>
          <p style="color: #b8956a; margin: 10px 0 0 0; font-size: 14px;">Médium & Clairvoyante</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #2c1b47; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Rappel de consultation</h2>
          
          <p style="color: #555; margin: 0 0 20px 0; line-height: 1.6;">Bonjour Maelle,</p>
          
          <p style="color: #d4a574; margin: 0 0 20px 0; line-height: 1.6; font-weight: 600;">Votre consultation va commencer dans 1 heure.</p>
          
          <!-- Reservation Details -->
          <div style="background-color: #f9f9f9; border-left: 4px solid #d4a574; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #666;">
              <strong style="color: #2c1b47;">Client :</strong><br>
              ${clientFirstName}
            </p>
            <p style="margin: 0 0 10px 0; color: #666;">
              <strong style="color: #2c1b47;">Heure :</strong><br>
              ${selectedTime}
            </p>
            <p style="margin: 0 0 10px 0; color: #666;">
              <strong style="color: #2c1b47;">Type de consultation :</strong><br>
              ${consultationLabel}
            </p>
            ${phone ? `<p style="margin: 0; color: #666;">
              <strong style="color: #2c1b47;">Le client vous appellera au :</strong><br>
              ${phone}
            </p>` : ""}
          </div>
          
          <p style="color: #555; margin: 20px 0; line-height: 1.6;">Préparez-vous pour cette consultation.</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #999; font-size: 12px; line-height: 1.6;">
            Maelle Mars - Médium & Clairvoyante<br>
            Cocolyly
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
