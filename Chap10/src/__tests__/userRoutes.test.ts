import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { prisma } from "../db.js";

// Mock the Prisma client so tests run quickly and independently of database state
vi.mock("../db.js", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("User Routes API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/users", () => {
    it("should return a list of users with status 200", async () => {
      const mockUsers = [
        {
          id: 1,
          username: "alice",
          email: "alice@example.com",
          profile: { bio: "Hello" },
        },
      ];

      (prisma.user.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockUsers);

      const response = await request(app).get("/api/v1/users");

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

      const response = await request(app).get("/api/v1/users/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 404 if user is not found", async () => {
      (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const response = await request(app).get("/api/v1/users/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User not found" });
    });
  });

  describe("POST /api/v1/users", () => {
    it("should create a user and return status 201", async () => {
      const newUser = {
        id: 2,
        username: "charlie",
        email: "charlie@example.com",
        name: "Charlie",
        role: "USER",
        profile: { bio: "Coder" },
      };

      (prisma.user.create as ReturnType<typeof vi.fn>).mockResolvedValue(newUser);

      const response = await request(app)
        .post("/api/v1/users")
        .send({
          username: "charlie",
          email: "charlie@example.com",
          name: "Charlie",
          bio: "Coder",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newUser);
      expect(prisma.user.create).toHaveBeenCalled();
    });
  });
});