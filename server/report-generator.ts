import { PDFDocument, rgb } from "pdf-lib";
import { getAllClients, getAllReservations } from "./db";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";

export interface MonthlyReportData {
  month: string;
  year: number;
  totalClients: number;
  newClients: number;
  totalConsultations: number;
  totalRevenue: number;
  averageConsultationPrice: number;
  clientsWithUpdates: number;
  clientsWithConferences: number;
  consultationsByType: Record<string, number>;
  topConsultationDates: Array<{ date: string; count: number }>;
}

/**
 * Calculate monthly statistics for the report
 */
export async function calculateMonthlyStats(month: number, year: number): Promise<MonthlyReportData> {
  const clients = await getAllClients();
  const reservations = await getAllReservations();

  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = endOfMonth(new Date(year, month - 1, 1));

  // Filter clients and reservations for the month
  const monthlyClients = clients.filter((c) => {
    const createdAt = new Date(c.createdAt);
    return createdAt >= monthStart && createdAt <= monthEnd;
  });

  const monthlyReservations = reservations.filter((r) => {
    const reservationDate = new Date(r.reservationDate);
    return reservationDate >= monthStart && reservationDate <= monthEnd;
  });

  // Calculate consultation types distribution
  const consultationsByType: Record<string, number> = {
    "25min": 0,
    "30min": 0,
    "40min": 0,
    "1hour": 0,
  };

  monthlyReservations.forEach((r) => {
    const type = r.consultationType as keyof typeof consultationsByType;
    if (type in consultationsByType) {
      consultationsByType[type]++;
    }
  });

  // Calculate revenue (rough estimate based on consultation types)
  const priceMap: Record<string, number> = {
    "25min": 70,
    "30min": 80,
    "40min": 110,
    "1hour": 150,
  };

  let totalRevenue = 0;
  monthlyReservations.forEach((r) => {
    const type = r.consultationType as keyof typeof priceMap;
    totalRevenue += priceMap[type] || 0;
  });

  // Calculate top consultation dates
  const dateMap: Record<string, number> = {};
  monthlyReservations.forEach((r) => {
    dateMap[r.reservationDate] = (dateMap[r.reservationDate] || 0) + 1;
  });

  const topConsultationDates = Object.entries(dateMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalConsultations = clients.reduce((sum, c) => sum + c.consultationCount, 0);
  const averageConsultationPrice = monthlyReservations.length > 0 ? totalRevenue / monthlyReservations.length : 0;

  return {
    month: format(monthStart, "MMMM", { locale: fr }),
    year,
    totalClients: clients.length,
    newClients: monthlyClients.length,
    totalConsultations,
    totalRevenue,
    averageConsultationPrice,
    clientsWithUpdates: clients.filter((c) => c.wantUpdates).length,
    clientsWithConferences: clients.filter((c) => c.wantConferences).length,
    consultationsByType,
    topConsultationDates,
  };
}

/**
 * Generate a PDF report with monthly statistics
 */
export async function generateMonthlyPDF(month: number, year: number): Promise<Buffer> {
  const stats = await calculateMonthlyStats(month, year);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const margin = 40;
  let yPosition = height - margin;

  // Helper function to draw text
  const drawText = (text: string, size: number, bold: boolean = false, color = rgb(0, 0, 0)) => {
    page.drawText(text, {
      x: margin,
      y: yPosition,
      size,
      color,
    });
    yPosition -= size + 10;
  };

  // Helper function to draw section title
  const drawSectionTitle = (title: string) => {
    page.drawText(title, {
      x: margin,
      y: yPosition,
      size: 14,
      color: rgb(0.8, 0.6, 0), // Gold color
    });
    yPosition -= 20;
  };

  // Helper function to draw key-value pair
  const drawKeyValue = (key: string, value: string) => {
    page.drawText(`${key}: ${value}`, {
      x: margin + 20,
      y: yPosition,
      size: 11,
      color: rgb(0, 0, 0),
    });
    yPosition -= 16;
  };

  // Header
  drawText(`Rapport Mensuel - ${stats.month} ${stats.year}`, 24, true, rgb(0.8, 0.6, 0));
  drawText("Maelle Mars - Médium & Clairvoyante", 12, false, rgb(0.5, 0.5, 0.5));
  yPosition -= 10;

  // Summary Section
  drawSectionTitle("📊 Résumé Général");
  drawKeyValue("Clients Total", `${stats.totalClients}`);
  drawKeyValue("Nouveaux Clients", `${stats.newClients}`);
  drawKeyValue("Total Consultations", `${stats.totalConsultations}`);
  drawKeyValue("Revenus Estimés", `€${stats.totalRevenue.toFixed(2)}`);
  drawKeyValue("Prix Moyen par Consultation", `€${stats.averageConsultationPrice.toFixed(2)}`);
  yPosition -= 10;

  // Engagement Section
  drawSectionTitle("💌 Engagement Clients");
  drawKeyValue("Clients Offres Promotionnelles", `${stats.clientsWithUpdates}`);
  drawKeyValue("Clients Conférences & Salons", `${stats.clientsWithConferences}`);
  yPosition -= 10;

  // Consultation Types Section
  drawSectionTitle("🔮 Types de Consultations");
  Object.entries(stats.consultationsByType).forEach(([type, count]) => {
    if (count > 0) {
      drawKeyValue(`Consultation ${type}`, `${count}`);
    }
  });
  yPosition -= 10;

  // Top Dates Section
  if (stats.topConsultationDates.length > 0) {
    drawSectionTitle("📅 Dates Populaires");
    stats.topConsultationDates.forEach(({ date, count }) => {
      drawKeyValue(`${date}`, `${count} consultation(s)`);
    });
    yPosition -= 10;
  }

  // Footer
  page.drawText(`Généré le ${format(new Date(), "dd MMMM yyyy", { locale: fr })}`, {
    x: margin,
    y: 20,
    size: 9,
    color: rgb(0.7, 0.7, 0.7),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Get filename for monthly report
 */
export function getReportFilename(month: number, year: number): string {
  const monthStr = String(month).padStart(2, "0");
  return `rapport-mensuel-${year}-${monthStr}.pdf`;
}
