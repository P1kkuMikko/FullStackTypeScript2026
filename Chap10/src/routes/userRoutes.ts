import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET all users
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// GET single user
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
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
});

// POST create user (delegates duplicate constraint P2002 to errorHandler)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, name, role, bio } = req.body;
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        role: role || undefined,
        profile: bio ? { create: { bio } } : undefined,
      },
      include: { profile: true },
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// PUT update user
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { name, role, bio } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        role,
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
});

// DELETE user
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;