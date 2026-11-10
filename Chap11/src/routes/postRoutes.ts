import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../db.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// GET all published posts (Public)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { id: true, username: true, email: true },
        },
        categories: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

// GET single post by ID (Public)
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true },
        },
        categories: true,
      },
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

// POST create post (Authenticated: authorId comes from JWT req.user)
router.post(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, content, published, categories } = req.body;

      const post = await prisma.post.create({
        data: {
          title,
          content,
          published: published ?? false,
          authorId: req.user!.id,
          categories: categories
            ? {
                connectOrCreate: (categories as string[]).map((name) => ({
                  where: { name },
                  create: { name },
                })),
              }
            : undefined,
        },
        include: { categories: true, author: true },
      });
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update post (Authenticated + Owner or ADMIN)
router.put(
  "/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = Number(req.params.id);
      const existing = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!existing) {
        res.status(404).json({ error: "NOT_FOUND" });
        return;
      }

      if (
        existing.authorId !== req.user!.id &&
        req.user!.role !== "ADMIN"
      ) {
        res.status(403).json({ error: "FORBIDDEN" });
        return;
      }

      const { title, content, published } = req.body;
      const updated = await prisma.post.update({
        where: { id: postId },
        data: { title, content, published },
        include: { categories: true },
      });
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE post (Authenticated + Owner or ADMIN)
router.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = Number(req.params.id);
      const existing = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!existing) {
        res.status(404).json({ error: "NOT_FOUND" });
        return;
      }

      if (
        existing.authorId !== req.user!.id &&
        req.user!.role !== "ADMIN"
      ) {
        res.status(403).json({ error: "FORBIDDEN" });
        return;
      }

      await prisma.post.delete({
        where: { id: postId },
      });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;