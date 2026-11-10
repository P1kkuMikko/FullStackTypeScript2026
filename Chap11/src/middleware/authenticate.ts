import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, jwtErrors } from "../utils/jwt.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "UNAUTHORIZED" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const { payload } = await verifyAccessToken(token);
    req.user = {
      id: Number(payload.sub),
      role: payload.role as string,
    };
    next();
  } catch (err) {
    if (err instanceof jwtErrors.JWTExpired) {
      res.status(401).json({ error: "TOKEN_EXPIRED" });
      return;
    }
    res.status(401).json({ error: "INVALID_TOKEN" });
  }
}