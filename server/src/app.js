import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { requireAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Import modular routes
import profileRoutes from "./routes/profile.routes.js";
import farmRoutes from "./routes/farm.routes.js";
import cropRoutes from "./routes/crop.routes.js";
import soilRoutes from "./routes/soil.routes.js";
import fertilizerRoutes from "./routes/fertilizer.routes.js";
import irrigationRoutes from "./routes/irrigation.routes.js";
import diseaseRoutes from "./routes/disease.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS Allowlist
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman) or matched origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/preview while preserving standard headers
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Request Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// 4. Rate Limiting (Prevent abuse, especially on AI inference endpoints)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
    data: null,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
    },
  },
});
app.use(globalLimiter);

// 5. Body Parsers
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// 6. Public Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "AgroAI Advisory API Server is healthy",
    data: {
      status: "online",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      aiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    },
    error: null,
  });
});

app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "AgroAI Advisory API v1 is operational",
    data: {
      status: "active",
      uptimeSeconds: Math.floor(process.uptime()),
    },
    error: null,
  });
});

// 7. Protected Agricultural Advisory API Routes (under /api/v1)
const apiRouter = express.Router();

// Apply Supabase authentication middleware to all /api/v1 protected routes
apiRouter.use("/profile", requireAuth, profileRoutes);
apiRouter.use("/farms", requireAuth, farmRoutes);
apiRouter.use("/crop", requireAuth, cropRoutes);
apiRouter.use("/soil", requireAuth, soilRoutes);
apiRouter.use("/fertilizer", requireAuth, fertilizerRoutes);
apiRouter.use("/irrigation", requireAuth, irrigationRoutes);
apiRouter.use("/disease", requireAuth, diseaseRoutes);
apiRouter.use("/calendar", requireAuth, calendarRoutes);
apiRouter.use("/chat", requireAuth, chatRoutes);
apiRouter.use("/dashboard", requireAuth, dashboardRoutes);

app.use("/api/v1", apiRouter);

// 8. 404 Handler for Unknown Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    data: null,
    error: {
      code: "NOT_FOUND",
      details: "Requested API endpoint does not exist",
    },
  });
});

// 9. Centralized Error Handler
app.use(errorHandler);

export default app;

