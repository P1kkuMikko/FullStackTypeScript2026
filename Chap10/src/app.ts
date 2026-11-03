import express from "express";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

// API Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/transactions", transactionRoutes);

// Centralized error handling
app.use(errorHandler);

// Only listen if not in a test runner
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
}

export default app;