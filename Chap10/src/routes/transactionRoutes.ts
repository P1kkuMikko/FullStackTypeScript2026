import { Router, Request, Response } from "express";
import { prisma } from "../db.js";

const router = Router();

// 1. Sequential Transaction: Create a user and an audit log / initial post together
router.post("/sequential", async (req: Request, res: Response) => {
  try {
    const { username, email, title, content } = req.body;

    // Both operations must succeed, or neither will
    const [newUser, newPost] = await prisma.$transaction([
      prisma.user.create({
        data: { username, email },
      }),
      // We can also batch updates/creates here
      prisma.post.create({
        data: {
          title: title || "Welcome post",
          content: content || "Default initial post",
          author: { connect: { username } },
        },
      }),
    ]);

    res.status(201).json({ user: newUser, post: newPost });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// 2. Interactive Transaction: Transfer post ownership or conditional multi-step flow
router.post("/transfer-posts", async (req: Request, res: Response) => {
  try {
    const { fromUserId, toUserId } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Step A: Ensure target user exists
      const targetUser = await tx.user.findUnique({
        where: { id: Number(toUserId) },
      });
      if (!targetUser) {
        throw new Error(`Target user with id ${toUserId} does not exist`);
      }

      // Step B: Reassign all posts from fromUserId to toUserId
      const updatedPosts = await tx.post.updateMany({
        where: { authorId: Number(fromUserId) },
        data: { authorId: Number(toUserId) },
      });

      return {
        transferredCount: updatedPosts.count,
        newOwner: targetUser.username,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;