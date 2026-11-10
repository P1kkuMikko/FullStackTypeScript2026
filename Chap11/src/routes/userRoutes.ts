import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../db.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

// GET /api/v1/users/me (Current authenticated user's profile)
router.get(
  "/me",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        include: { profile: true, posts: true },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/v1/users/me (Update current authenticated user's profile)
router.put(
  "/me",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, bio } = req.body;
      const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          name,
          profile: bio
            ? {
                upsert: {
                  create: { bio },
                  update: { bio },
                },
              }
            : undefined,
        },
        include: { profile: true },
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/v1/users (Admin only: list all users)
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        include: { profile: true },
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/v1/users/:id (Authenticated: get user by id)
router.get(
  "/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = await prisma.user.findUnique({
        where: { id },
        include: { profile: true, posts: true },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/v1/users/:id (Admin only: delete user)
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await prisma.user.delete({
        where: { id },
      });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;