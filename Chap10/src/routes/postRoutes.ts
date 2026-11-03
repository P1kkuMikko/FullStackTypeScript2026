import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET all published posts
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

// GET single post by ID
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

// POST create post
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, published, authorId, categories } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published ?? false,
        authorId: Number(authorId),
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
});

// PUT update post
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { title, content, published } = req.body;
    const post = await prisma.post.update({
      where: { id },
      data: { title, content, published },
      include: { categories: true },
    });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

// DELETE post (throws P2025 if post doesn't exist)
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await prisma.post.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;