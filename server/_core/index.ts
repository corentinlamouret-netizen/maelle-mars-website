import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { initializeSecurity } from "./security";

import { startReminderScheduler } from "../reminder-scheduler";
import { handlePayPalWebhook } from "../paypal-webhook";

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.set("trust proxy", 1);

  initializeSecurity(app);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // PayPal webhook
  app.post("/api/webhooks/paypal", async (req, res) => {
    try {
      console.log("[PayPal Webhook] Received webhook");
      await handlePayPalWebhook(req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("[PayPal Webhook] Error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "3000");

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);

    try {
      startReminderScheduler();
    } catch (error) {
      console.error("Failed to start reminder scheduler:", error);
    }
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
