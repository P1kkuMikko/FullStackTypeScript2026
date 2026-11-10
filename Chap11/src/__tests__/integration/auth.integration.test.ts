import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { prisma, cleanDb } from "./setup.js";
import { createTestUser } from "../helpers.js";

describe("Auth endpoints", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await cleanDb();
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("creates a user and returns an access token", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "new@example.com",
        username: "NewUser",
        password: "StrongPassword123!",
      });

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe("new@example.com");
      expect(res.body.user.password).toBeUndefined();
      expect(res.body.accessToken).toBeDefined();
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"][0]).toContain("HttpOnly");
    });
  });

  describe("Protected routes", () => {
    it("returns 401 without a token and 403 without the required role", async () => {
      const noToken = await request(app).get("/api/v1/users");
      expect(noToken.status).toBe(401);

      const { accessToken } = await createTestUser();
      const forbidden = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(forbidden.status).toBe(403);
    });
  });

  describe("Refresh and logout", () => {
    it("invalidates the refresh token on logout", async () => {
      const { cookies } = await createTestUser();

      await request(app).post("/api/auth/logout").set("Cookie", cookies);

      const res = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", cookies);

      expect(res.status).toBe(401);
    });
  });
});