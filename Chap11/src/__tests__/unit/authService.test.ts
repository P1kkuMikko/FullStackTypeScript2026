import "dotenv/config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import argon2 from "argon2";
import { prisma } from "../../db.js";
import { registerUser, loginUser } from "../../services/authService.js";

vi.mock("../../db.js", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
    },
  },
}));

vi.mock("argon2");

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    it("hashes the password and creates a user", async () => {
      vi.mocked(argon2.hash).mockResolvedValue("$argon2id$hashed");
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 1,
        email: "alice@example.com",
        username: "alice",
        name: null,
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);
      vi.mocked(prisma.refreshToken.create).mockResolvedValue({} as never);

      const result = await registerUser({
        email: "alice@example.com",
        username: "alice",
        password: "Password123!",
      });

      expect(argon2.hash).toHaveBeenCalledWith("Password123!", {
        type: argon2.argon2id,
      });
      expect(result.user.email).toBe("alice@example.com");
      expect(result.accessToken).toBeDefined();
    });
  });

  describe("loginUser", () => {
    it("throws generic error for wrong password", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 1,
        email: "alice@example.com",
        username: "alice",
        password: "$argon2id$hashed",
        role: "USER",
      } as never);
      vi.mocked(argon2.verify).mockResolvedValue(false);

      await expect(
        loginUser({ email: "alice@example.com", password: "wrong" })
      ).rejects.toThrow("Invalid email or password");
    });
  });
});