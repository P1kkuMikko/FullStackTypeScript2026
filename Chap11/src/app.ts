import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// 1. Security headers first
app.use(helmet());

// 2. Rate limiters before route handlers
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "TOO_MANY_REQUESTS", retryAfter: "15 minutes" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "TOO_MANY_ATTEMPTS",
    retryAfter: "15 minutes",
  },
});

app.use("/api", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/refresh", authLimiter);

// 3. Body and cookie parsers
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// 4. Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/transactions", transactionRoutes);

// 5. Centralized error handling last
app.use(errorHandler);

// Only listen if not in a test runner
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
}

export default app;