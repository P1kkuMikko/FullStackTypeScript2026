import "dotenv/config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { prisma } from "../db.js";
import { createAccessToken } from "../utils/jwt.js";

vi.mock("../db.js", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("User Routes API", () => {
  let adminToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    adminToken = await createAccessToken(1, "ADMIN");
  });

  describe("GET /api/v1/users", () => {
    it("should return a list of users with status 200 for ADMIN", async () => {
      const mockUsers = [
        {
          id: 1,
          username: "alice",
          email: "alice@example.com",
          profile: { bio: "Hello" },
        },
      ];

      (prisma.user.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockUsers);

      const response = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/v1/users/:id", () => {
    it("should return a single user when ID exists", async () => {
      const mockUser = {
        id: 1,
        username: "alice",
        email: "alice@example.com",
        profile: null,
        posts: [],
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockUser);

      const response = await request(app)
        .get("/api/v1/users/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 404 if user is not found", async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const response = await request(app)
        .get("/api/v1/users/999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User not found" });
    });
  });

  describe("GET /api/v1/users/me", () => {
    it("should return the authenticated user's profile", async () => {
      const mockMe = {
        id: 1,
        username: "alice",
        email: "alice@example.com",
        role: "ADMIN",
        profile: { bio: "Admin user" },
        posts: [],
      };

      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(mockMe);

      const response = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMe);
    });
  });
});