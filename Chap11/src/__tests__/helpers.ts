import request from "supertest";
import app from "../app.js";

export async function createTestUser(
  overrides: Partial<{
    email: string;
    username: string;
    password: string;
  }> = {}
) {
  const userData = {
    email: `test-${Date.now()}@example.com`,
    username: `user_${Date.now()}`,
    password: "TestPassword123!",
    ...overrides,
  };

  const res = await request(app).post("/api/auth/register").send(userData);

  return {
    user: res.body.user,
    accessToken: res.body.accessToken,
    cookies: res.headers["set-cookie"],
  };
}