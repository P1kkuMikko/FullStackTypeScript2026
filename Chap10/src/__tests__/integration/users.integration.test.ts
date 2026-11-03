import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma, cleanDb } from "./setup.js";

describe("User Integration Tests (Real Database)", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await cleanDb();
    await prisma.$disconnect();
  });

  it("should create and retrieve a user from the real database", async () => {
    const user = await prisma.user.create({
      data: {
        email: "realtest@example.com",
        username: "realuser",
        name: "Real Tester",
      },
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("realtest@example.com");

    const found = await prisma.user.findUnique({
      where: { id: user.id },
    });

    expect(found).not.toBeNull();
    expect(found?.name).toBe("Real Tester");
  });

  it("should reject duplicate emails with a unique constraint error", async () => {
    await prisma.user.create({
      data: {
        email: "duplicate@example.com",
        username: "user1",
        name: "First User",
      },
    });

    await expect(
      prisma.user.create({
        data: {
          email: "duplicate@example.com",
          username: "user2",
          name: "Second User",
        },
      })
    ).rejects.toThrow();
  });
});