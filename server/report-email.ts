import { sendEmail } from "./mailer";
import { generateMonthlyPDF, getReportFilename, calculateMonthlyStats } from "./report-generator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ADMIN_EMAIL = "maellemars@gmail.com";

/**
 * Generate and send monthly report email to admin
 */
export async function sendMonthlyReportEmail(month: number, year: number): Promise<boolean> {
  try {
    // Generate PDF
    const pdfBuffer = await generateMonthlyPDF(month, year);
    const filename = getReportFilename(month, year);

    // Get statistics for email body
    const stats = await calculateMonthlyStats(month, year);

    // Create email HTML
    const monthName = format(new Date(year, month - 1, 1), "MMMM yyyy", { locale: fr });
    const emailHTML = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4af37 0%, #8b7500 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; font-size: 24px; }
            .stats { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .stat-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .stat-row:last-child { border-bottom: none; }
            .stat-label { font-weight: bold; color: #666; }
            .stat-value { color: #d4af37; font-weight: bold; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
            .button { background: #d4af37; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Rapport Mensuel</h1>
              <p>${monthName}</p>
            </div>

            <p>Bonjour Maelle,</p>
            <p>Voici votre rapport mensuel pour ${monthName}. Les statistiques clés sont résumées ci-dessous.</p>

            <div class="stats">
              <div class="stat-row">
                <span class="stat-label">Clients Total</span>
                <span class="stat-value">${stats.totalClients}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Nouveaux Clients</span>
                <span class="stat-value">${stats.newClients}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Total Consultations</span>
                <span class="stat-value">${stats.totalConsultations}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Revenus Estimés</span>
                <span class="stat-value">€${stats.totalRevenue.toFixed(2)}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Prix Moyen</span>
                <span class="stat-value">€${stats.averageConsultationPrice.toFixed(2)}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Clients Offres Promo</span>
                <span class="stat-value">${stats.clientsWithUpdates}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">Clients Conférences</span>
                <span class="stat-value">${stats.clientsWithConferences}</span>
              </div>
            </div>

            <p>Le rapport détaillé en PDF est joint à cet email.</p>

            <div class="footer">
              <p>Rapport généré automatiquement par le système de gestion Maelle Mars</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email with PDF attachment
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `Rapport Mensuel - ${monthName}`,
      html: emailHTML,
      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log(`[Report Email] Monthly report sent to ${ADMIN_EMAIL}`);
    return true;
  } catch (error) {
    console.error("[Report Email] Error sending monthly report:", error);
    return false;
  }
}

/**
 * Schedule monthly report email (called on the 1st of each month)
 */
export async function scheduleMonthlyReport(): Promise<void> {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  await sendMonthlyReportEmail(lastMonth.getMonth() + 1, lastMonth.getFullYear());
}
