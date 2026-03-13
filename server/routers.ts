import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createReservation, updateReservationStatus, createReservationV2, isTimeSlotAvailable, getReservationsByDate, getBlockedSlotsByDate, createBlockedTimeSlot, deleteBlockedTimeSlot, getAllReservations, getMonthlyStats, getDailyVisitors, trackPageVisit, createPaypalPayment, getPaymentByTransactionId, updatePaymentStatus, getReservationById, updateReservationPaymentStatus, upsertClient, getClientByEmail, getAllClients, getAllPayments } from "./db";
import { sendEmail, generateClientConfirmationEmail, generateMaelleNotificationEmail } from "./mailer";
import { handlePayPalWebhook } from "./paypal-webhook";
import { isUserAdmin, canAccessAdminDashboard } from "./admin-auth";
import { updateReservation, cancelReservation, searchReservationsByEmail, searchReservationsByName, searchReservationsByDateRange, searchReservationsByType, searchReservationsByPaymentStatus, exportReservationsAsCSV } from "./reservation-management";
import { getUpcomingEvents, getEventById, createEvent, updateEvent, deleteEvent, addEventAttendee, getEventAttendees, getAttendeeById, updateAttendeePaymentStatus, cancelAttendeeReservation, getEventsByDateRange } from "./events-db";


import { notifyOwnerOfNewClient } from "./notification-handler";
import { sendMonthlyReportEmail, scheduleMonthlyReport } from "./report-email";
import { generateMonthlyPDF } from "./report-generator";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  reservations: router({
    create: publicProcedure
      .input(
        z.object({
          firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
          lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
          email: z.string().email("Email invalide").refine(
            (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            "Format d'email invalide"
          ),
          phone: z.string().refine(
            (phone) => {
              const cleanPhone = phone.replace(/[\s.-]/g, '');
              return /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/.test(cleanPhone);
            },
            "Téléphone invalide (ex: 06 12 34 56 78 ou +33 6 12 34 56 78)"
          ),
          address: z.string().min(10, "L'adresse doit contenir au moins 10 caractères"),
          consultationType: z.enum(["10min", "15min", "25min", "30min", "40min", "1hour"]),
          selectedTime: z.string().min(1),
          wantsUpdates: z.boolean(),
          acceptedTerms: z.boolean(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Create reservation in database
          const result = await createReservation({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            address: input.address,
            consultationType: input.consultationType,
            selectedTime: input.selectedTime,
            wantsUpdates: input.wantsUpdates ? 1 : 0,
            acceptedTerms: input.acceptedTerms ? 1 : 0,
            emailSent: 0,
            smsSent: 0,
          });

          // Get the reservation ID from the result
          if (!result) {
            throw new Error("Impossible de créer la réservation dans la base de données");
          }
          
          const reservationId = (result as any).insertId || 0;
          
          if (reservationId <= 0) {
            throw new Error("Impossible de récupérer l'ID de la réservation");
          }

          // Send confirmation email to client
          const clientEmailHtml = generateClientConfirmationEmail(
            input.firstName,
            input.consultationType,
            input.selectedTime
          );
          const emailSent = await sendEmail({
            to: input.email,
            subject: "Confirmation de votre reservation avec Maelle Mars",
            html: clientEmailHtml,
          });

          // Send notification email to Maelle
          const maelleEmailHtml = generateMaelleNotificationEmail(
            input.firstName,
            input.lastName,
            input.consultationType,
            input.selectedTime
          );
          await sendEmail({
            to: "maellemars@gmail.com",
            subject: "Nouvelle réservation de consultation",
            html: maelleEmailHtml,
          });

          // Update reservation status
          if (reservationId > 0) {
            await updateReservationStatus(reservationId, emailSent, false);
          }

          return {
            success: true,
            reservationId,
            message: "Reservation confirmee avec succes",
          };
        } catch (error) {
          console.error("[Reservation] Error:", error);
          throw new Error("Erreur lors de la creation de la reservation");
        }
      }),

    // New endpoint for V2 reservations with date/time
    createV2: publicProcedure
      .input(
        z.object({
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(1),
          address: z.string().min(1),
          consultationType: z.enum(["10min", "15min", "25min", "30min", "40min", "1hour"]),
          reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          startTime: z.string().regex(/^\d{2}:\d{2}$/),
          endTime: z.string().regex(/^\d{2}:\d{2}$/),
          wantsUpdates: z.boolean(),
          acceptedTerms: z.boolean(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Check if time slot is available
          const isAvailable = await isTimeSlotAvailable(
            input.reservationDate,
            input.startTime,
            input.endTime
          );

          if (!isAvailable) {
            throw new Error("Ce créneau horaire n'est pas disponible");
          }

          // Create reservation
          const result = await createReservationV2({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
            address: input.address,
            consultationType: input.consultationType,
            reservationDate: input.reservationDate,
            startTime: input.startTime,
            endTime: input.endTime,
            wantsUpdates: input.wantsUpdates ? 1 : 0,
            acceptedTerms: input.acceptedTerms ? 1 : 0,
            emailSent: 0,
            smsSent: 0,
          });

          if (!result) {
            throw new Error("Impossible de créer la réservation dans la base de données");
          }

          const reservationId = (result as any).insertId || 0;
          
          if (reservationId <= 0) {
            throw new Error("Impossible de récupérer l'ID de la réservation");
          }

          // Send emails
          const timeSlot = `${input.startTime} - ${input.endTime}`;
          const clientEmailHtml = generateClientConfirmationEmail(
            input.firstName,
            input.consultationType,
            timeSlot
          );
          await sendEmail({
            to: input.email,
            subject: "Confirmation de votre reservation avec Maelle Mars",
            html: clientEmailHtml,
          });

          const maelleEmailHtml = generateMaelleNotificationEmail(
            input.firstName,
            input.lastName,
            input.consultationType,
            timeSlot
          );
          await sendEmail({
            to: "maellemars@gmail.com",
            subject: "Nouvelle réservation de consultation",
            html: maelleEmailHtml,
          });

          return {
            success: true,
            reservationId,
            message: "Reservation confirmee avec succes",
          };
        } catch (error) {
          console.error("[Reservation V2] Error:", error);
          throw new Error(error instanceof Error ? error.message : "Erreur lors de la creation de la reservation");
        }
      }),

    // Get available time slots for a specific date
    getAvailableSlots: publicProcedure
      .input(
        z.object({
          date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          consultationType: z.enum(["10min", "15min", "25min", "30min", "40min", "1hour"]),
        })
      )
      .query(async ({ input }) => {
        try {
          const reservations = await getReservationsByDate(input.date);
          const blockedSlots = await getBlockedSlotsByDate(input.date);

          // Define available time slots based on consultation type
          const allSlots: { startTime: string; endTime: string }[] = [];
          
          // Helper: convert total minutes to "HH:MM" string
          const minutesToTime = (totalMinutes: number) => {
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
          };

          if (input.consultationType === "10min") {
            // 10-minute slots from 09:00 to 19:50 (last slot ends at 20:00)
            for (let startMin = 9 * 60; startMin + 10 <= 20 * 60; startMin += 15) {
              allSlots.push({
                startTime: minutesToTime(startMin),
                endTime: minutesToTime(startMin + 10),
              });
            }
          } else if (input.consultationType === "15min") {
            // 15-minute slots from 09:00 to 19:45 (last slot ends at 20:00)
            for (let startMin = 9 * 60; startMin + 15 <= 20 * 60; startMin += 20) {
              allSlots.push({
                startTime: minutesToTime(startMin),
                endTime: minutesToTime(startMin + 15),
              });
            }
          } else if (input.consultationType === "25min") {
            // 25-minute slots from 09:00 to 19:35 (last slot ends at 20:00)
            for (let startMin = 9 * 60; startMin + 25 <= 20 * 60; startMin += 30) {
              allSlots.push({
                startTime: minutesToTime(startMin),
                endTime: minutesToTime(startMin + 25),
              });
            }
          } else if (input.consultationType === "30min") {
            // 30-minute slots from 09:00 to 19:30
            for (let startMin = 9 * 60; startMin + 30 <= 20 * 60; startMin += 30) {
              allSlots.push({
                startTime: minutesToTime(startMin),
                endTime: minutesToTime(startMin + 30),
              });
            }
          } else if (input.consultationType === "40min") {
            // 40-minute slots from 09:00 to 19:20
            for (let startMin = 9 * 60; startMin + 40 <= 20 * 60; startMin += 60) {
              allSlots.push({
                startTime: minutesToTime(startMin),
                endTime: minutesToTime(startMin + 40),
              });
            }
          } else if (input.consultationType === "1hour") {
            // 1-hour slots from 09:00 to 19:00
            for (let startMin = 9 * 60; startMin + 60 <= 20 * 60; startMin += 60) {
              allSlots.push({
                startTime: minutesToTime(startMin),
                endTime: minutesToTime(startMin + 60),
              });
            }
          }

          // Filter out unavailable slots
          const availableSlots = [];
          for (const slot of allSlots) {
            const isAvailable = await isTimeSlotAvailable(input.date, slot.startTime, slot.endTime);
            if (isAvailable) {
              availableSlots.push(slot);
            }
          }

          return availableSlots;
        } catch (error) {
          console.error("[Available Slots] Error:", error);
          throw new Error("Erreur lors de la recuperation des créneaux disponibles");
        }
      }),
  }),

  // Admin endpoints for managing blocked time slots and viewing reservations
  admin: router({
    // Get all reservations (admin only)
    getAllReservations: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await getAllReservations();
      }),

    // Get reservations for a specific date
    getReservationsByDate: protectedProcedure
      .input(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await getReservationsByDate(input.date);
      }),

    // Get blocked time slots for a specific date
    getBlockedSlots: protectedProcedure
      .input(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await getBlockedSlotsByDate(input.date);
      }),

    // Create a blocked time slot
    blockTimeSlot: protectedProcedure
      .input(
        z.object({
          date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          startTime: z.string().regex(/^\d{2}:\d{2}$/),
          endTime: z.string().regex(/^\d{2}:\d{2}$/),
          reason: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await createBlockedTimeSlot({
          date: input.date,
          startTime: input.startTime,
          endTime: input.endTime,
          reason: input.reason,
        });
      }),

    // Delete a blocked time slot
    unblockTimeSlot: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await deleteBlockedTimeSlot(input.id);
      }),

    // Get monthly statistics
    getMonthlyStats: protectedProcedure
      .input(z.object({ year: z.number(), month: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await getMonthlyStats(input.year, input.month);
      }),

    // Get daily visitor statistics
    getDailyVisitors: protectedProcedure
      .input(z.object({ year: z.number(), month: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await getDailyVisitors(input.year, input.month);
      }),

    // Get all payments (admin only)
    getAllPayments: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await getAllPayments();
      }),

    checkAccess: protectedProcedure.query(async ({ ctx }) => {
      const hasAccess = await canAccessAdminDashboard(ctx.user?.id);
      return { hasAccess, isAdmin: ctx.user?.role === "admin" };
    }),

    getReservationById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await getReservationById(input.id);
      }),

    updateReservation: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          reservationDate: z.string().optional(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
          consultationType: z.enum(["10min", "15min", "25min", "30min", "40min", "1hour"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { id, ...updates } = input;
        return await updateReservation(id, updates);
      }),

    cancelReservation: protectedProcedure
      .input(z.object({ id: z.number(), reason: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await cancelReservation(input.id, input.reason);
      }),

    searchByEmail: protectedProcedure
      .input(z.object({ email: z.string() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await searchReservationsByEmail(input.email);
      }),

    searchByName: protectedProcedure
      .input(z.object({ name: z.string() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await searchReservationsByName(input.name);
      }),

    searchByDateRange: protectedProcedure
      .input(z.object({ startDate: z.string(), endDate: z.string() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await searchReservationsByDateRange(input.startDate, input.endDate);
      }),

    searchByType: protectedProcedure
      .input(z.object({ consultationType: z.enum(["10min", "15min", "25min", "30min", "40min", "1hour"]) }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await searchReservationsByType(input.consultationType);
      }),

    searchByPaymentStatus: protectedProcedure
      .input(z.object({ status: z.enum(["pending", "completed", "failed"]) }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await searchReservationsByPaymentStatus(input.status);
      }),

    exportAsCSV: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      const reservations = await getAllReservations();
      return await exportReservationsAsCSV(reservations);
    }),
  }),

  // PayPal payment endpoints
  payments: router({
    // Create a payment record
    createPayment: publicProcedure
      .input(
        z.object({
          reservationId: z.number(),
          paypalTransactionId: z.string(),
          amount: z.number(),
          currency: z.string().default("EUR"),
          payerEmail: z.string().optional(),
          payerName: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          return await createPaypalPayment({
            reservationId: input.reservationId,
            paypalTransactionId: input.paypalTransactionId,
            amount: input.amount,
            currency: input.currency,
            payerEmail: input.payerEmail,
            payerName: input.payerName,
            paymentStatus: "pending",
          });
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Erreur lors de la creation du paiement");
        }
      }),

    // Get payment by transaction ID
    getPayment: publicProcedure
      .input(z.object({ transactionId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await getPaymentByTransactionId(input.transactionId);
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Erreur lors de la recuperation du paiement");
        }
      }),

    // Update payment status (webhook endpoint)
    updatePaymentStatus: publicProcedure
      .input(
        z.object({
          paymentId: z.number(),
          status: z.enum(["pending", "completed", "failed", "refunded"]),
        })
      )
      .mutation(async ({ input }) => {
        try {
          return await updatePaymentStatus(input.paymentId, input.status);
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Erreur lors de la mise a jour du paiement");
        }
      }),

    webhook: publicProcedure
      .input(z.any())
      .mutation(async ({ input }) => {
        try {
          await handlePayPalWebhook(input);
          return { success: true };
        } catch (error) {
          console.error("[PayPal Webhook] Error:", error);
          return { success: false, error: error instanceof Error ? error.message : "Erreur lors du traitement du webhook" };
        }
      }),
  }),

  clients: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getAllClients();
    }),

    getByEmail: protectedProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await getClientByEmail(input.email);
      }),

    create: protectedProcedure
      .input(
        z.object({
          firstName: z.string().min(2),
          lastName: z.string().min(2),
          email: z.string().email(),
          phone: z.string(),
          consultationCount: z.number().default(0),
          wantUpdates: z.number().default(0),
          wantConferences: z.number().default(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const result = await upsertClient(input);
        
        // Send notification to owner about new client
        try {
          await notifyOwnerOfNewClient({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            phone: input.phone,
          });
        } catch (error) {
          console.error("Error sending notification:", error);
        }
        
        return result;
      }),

    notifyOwner: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          content: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await notifyOwnerOfNewClient({
          firstName: "Admin",
          lastName: "Notification",
          email: ctx.user?.email || "",
          phone: "",
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          consultationCount: z.number().optional(),
          wantUpdates: z.number().optional(),
          wantConferences: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const { id, ...updates } = input;
        // Note: upsertClient doesn't support updating by id, only by email
        // This is a limitation of the current implementation
        throw new Error("Update by id not supported. Use email-based updates instead.");
        // return await upsertClient({ ...updates });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        // Note: Delete functionality not implemented for clients
        throw new Error("Delete functionality not implemented");
      }),
  }),

  events: router({
    getUpcoming: publicProcedure.query(async () => {
      return await getUpcomingEvents();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getEventById(input.id);
      }),
  }),

  reports: router({
    generateAndSend: protectedProcedure
      .input(
        z.object({
          month: z.number().min(1).max(12),
          year: z.number().min(2020),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await sendMonthlyReportEmail(input.month, input.year);
      }),
  }),

});

export type AppRouter = typeof appRouter;
