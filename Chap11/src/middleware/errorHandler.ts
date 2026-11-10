import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { AuthError } from "../errors.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AuthError) {
    res.status(400).json({ error: err.message });
    return;
  }

  // Check if this is a known Prisma database error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const target = (err.meta?.target as string[])?.join(", ") || "field";
        res.status(409).json({
          error: `A record with this ${target} already exists.`,
          code: err.code,
        });
        return;
      }
      case "P2025": {
        res.status(404).json({
          error: "Record not found.",
          code: err.code,
        });
        return;
      }
      case "P2003": {
        res.status(400).json({
          error: "Foreign key constraint failed.",
          code: err.code,
        });
        return;
      }
      default: {
        res.status(400).json({
          error: `Database error: ${err.message}`,
          code: err.code,
        });
        return;
      }
    }
  }

  // Fallback for all other standard errors
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: err.message || "Internal server error",
  });
}