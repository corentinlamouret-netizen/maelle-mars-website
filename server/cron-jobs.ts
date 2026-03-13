/**
 * Cron Jobs Service
 * Handles scheduled tasks like monthly report generation and sending
 */

import { CronJob } from "cron";
import { calculateMonthlyStats } from "./report-generator";
import { sendMonthlyReportEmail } from "./report-email";

let monthlyReportJob: CronJob | null = null;

/**
 * Initialize all cron jobs
 */
export function initializeCronJobs() {
  console.log("[Cron] Initializing scheduled jobs...");
  
  // Schedule monthly report generation for the 1st of each month at 9:00 AM
  monthlyReportJob = new CronJob(
    "0 9 1 * *", // Every 1st of the month at 9:00 AM
    async () => {
      console.log("[Cron] Running monthly report job...");
      try {
        await generateMonthlyReportJob();
      } catch (error) {
        console.error("[Cron] Error in monthly report job:", error);
      }
    },
    null, // onComplete
    true, // start immediately
    "UTC" // timezone
  );

  console.log("[Cron] Monthly report job scheduled for 1st of each month at 9:00 AM UTC");
}

/**
 * Generate and send monthly report
 */
async function generateMonthlyReportJob() {
  try {
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    console.log(`[Cron] Generating report for ${lastMonth}/${lastYear}...`);

    // Generate statistics for last month
    const stats = await calculateMonthlyStats(lastMonth, lastYear);

    // Send email with report
    const result = await sendMonthlyReportEmail(lastMonth, lastYear);

    if (result) {
      console.log(`[Cron] Monthly report successfully sent to maellemars@gmail.com`);
    } else {
      console.error("[Cron] Failed to send monthly report");
    }
  } catch (error) {
    console.error("[Cron] Error generating monthly report:", error);
  }
}

/**
 * Stop all cron jobs
 */
export function stopCronJobs() {
  if (monthlyReportJob) {
    monthlyReportJob.stop();
    console.log("[Cron] Monthly report job stopped");
  }
}

/**
 * Get cron job status
 */
export function getCronJobStatus() {
  return {
    monthlyReport: {
      running: monthlyReportJob !== null,
      nextDate: monthlyReportJob?.nextDate() || null,
    },
  };
}
