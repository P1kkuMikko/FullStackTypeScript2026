import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../db.js";
import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { registerSchema, loginSchema } from "../schemas/auth.js";
import { registerUser, loginUser } from "../services/authService.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/cookies.js";
import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
  daysFromNow,
} from "../utils/jwt.js";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken, refreshToken } = await registerUser(req.body);
      setRefreshTokenCookie(res, refreshToken);
      res.status(201).json({ user, accessToken });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken, refreshToken } = await loginUser(req.body);
      setRefreshTokenCookie(res, refreshToken);
      res.status(200).json({ user, accessToken });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/refresh (with atomic token rotation)
router.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) {
        res.status(401).json({ error: "NO_REFRESH_TOKEN" });
        return;
      }

      try {
        await verifyRefreshToken(token);
      } catch {
        clearRefreshTokenCookie(res);
        res.status(401).json({ error: "INVALID_REFRESH_TOKEN" });
        return;
      }

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        clearRefreshTokenCookie(res);
        res.status(401).json({ error: "TOKEN_REVOKED" });
        return;
      }

      const newRefreshToken = await createRefreshToken(storedToken.userId);
      const newAccessToken = await createAccessToken(
        storedToken.userId,
        storedToken.user.role
      );

      await prisma.$transaction([
        prisma.refreshToken.delete({ where: { id: storedToken.id } }),
        prisma.refreshToken.create({
          data: {
            token: newRefreshToken,
            userId: storedToken.userId,
            expiresAt: daysFromNow(7),
          },
        }),
      ]);

      setRefreshTokenCookie(res, newRefreshToken);
      res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/logout
router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refreshToken;
      if (token) {
        await prisma.refreshToken.deleteMany({ where: { token } });
      }
      clearRefreshTokenCookie(res);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/auth/sessions (Log out from all devices)
router.delete(
  "/sessions",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.refreshToken.deleteMany({
        where: { userId: req.user!.id },
      });
      clearRefreshTokenCookie(res);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

export default router;