/**
 * Security Middleware Configuration
 * Implements Helmet, CORS, Rate Limiting, and other security measures
 */

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import type { Express, Request, Response, NextFunction } from "express";
import { ENV } from "./env";

/**
 * Configure Helmet.js for security headers
 */
export function configureHelmet(app: Express) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
          styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
          fontSrc: ["'self'", "fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.manus.im", "https://forge.manus.ai"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      dnsPrefetchControl: true,
      frameguard: { action: "deny" },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      xssFilter: true,
    })
  );

  console.log("[Security] Helmet.js configured");
}

/**
 * Configure CORS with strict origin checking
 */
export function configureCORS(app: Express) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : ENV.isProduction
      ? [] // No origins allowed in production by default
      : ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:5173"];

  app.use(
    cors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
          return callback(null, true);
        }

        // In development, allow all localhost origins
        if (!ENV.isProduction && origin.includes("localhost")) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else if (!ENV.isProduction) {
          // In development, log but allow
          console.warn(`[Security] CORS request from origin: ${origin}`);
          callback(null, true);
        } else {
          console.warn(`[Security] CORS blocked request from origin: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400, // 24 hours
    })
  );

  console.log("[Security] CORS configured with origins:", allowedOrigins);
}

/**
 * Configure Rate Limiting
 */
export function configureRateLimiting(app: Express) {
  // In development, use much higher limits
  const isDev = !ENV.isProduction;
  
  // General rate limiter
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDev ? 10000 : 100, // 10000 requests in dev, 100 in production
    message: "Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === "/health";
    },
  });

  // Strict rate limiter for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDev ? 1000 : 5, // 1000 requests in dev, 5 in production
    message: "Trop de tentatives de connexion, veuillez réessayer plus tard.",
    skipSuccessfulRequests: true, // Don't count successful requests
  });

  // API rate limiter
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: isDev ? 10000 : 30, // 10000 requests in dev, 30 in production
    message: "Trop de requêtes API, veuillez réessayer plus tard.",
  });

  // Apply general limiter to all routes
  app.use(generalLimiter);

  // Apply strict limiter to auth routes
  app.use("/api/oauth/callback", authLimiter);
  app.use("/api/trpc/auth", authLimiter);

  // Apply API limiter to tRPC endpoints
  app.use("/api/trpc", apiLimiter);

  console.log("[Security] Rate limiting configured");
}

/**
 * Security logging middleware
 */
export function securityLogging(req: Request, res: Response, next: NextFunction) {
  // Log suspicious patterns
  const suspiciousPatterns = [
    /(\.\.|\/\/|\\\\)/g, // Path traversal
    /(union|select|insert|delete|drop|update)/gi, // SQL injection
    /(<script|javascript:|onerror|onload)/gi, // XSS
  ];

  const queryString = JSON.stringify(req.query);
  const bodyString = JSON.stringify(req.body);

  suspiciousPatterns.forEach((pattern) => {
    if (pattern.test(queryString) || pattern.test(bodyString)) {
      console.warn(`[Security] Suspicious pattern detected in request:`, {
        method: req.method,
        path: req.path,
        ip: req.ip,
        pattern: pattern.toString(),
      });
    }
  });

  // Log all admin operations
  if (req.path.includes("/admin") || req.path.includes("/api/trpc/admin")) {
    console.log(`[Security] Admin operation: ${req.method} ${req.path}`, {
      ip: req.ip,
      userId: (req as any).userId,
      timestamp: new Date().toISOString(),
    });
  }

  next();
}

/**
 * HTTPS redirect middleware (for production)
 */
export function httpsRedirect(req: Request, res: Response, next: NextFunction) {
  if (ENV.isProduction && req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
}

/**
 * Security headers middleware
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Feature policy / Permissions policy
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=()"
  );

  next();
}

/**
 * Initialize all security middleware
 */
export function initializeSecurity(app: Express) {
  console.log("[Security] Initializing security middleware...");

  // HTTPS redirect (must be first)
  app.use(httpsRedirect);

  // Security headers
  app.use(securityHeaders);

  // Helmet.js
  configureHelmet(app);

  // CORS
  configureCORS(app);

  // Rate limiting
  configureRateLimiting(app);

  // Security logging
  app.use(securityLogging);

  console.log("[Security] All security middleware initialized");
}
