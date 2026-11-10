import argon2 from "argon2";
import { prisma } from "../db.js";
import { Prisma } from "../generated/prisma/client.js";
import { AuthError } from "../errors.js";
import {
  createAccessToken,
  createRefreshToken,
  daysFromNow,
} from "../utils/jwt.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.js";

export async function registerUser(input: RegisterInput) {
  const hashedPassword = await argon2.hash(input.password, {
    type: argon2.argon2id,
  });

  let user;
  try {
    user = await prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: hashedPassword,
      },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new AuthError("An account with this email already exists");
    }
    throw err;
  }

  const accessToken = await createAccessToken(user.id, user.role);
  const refreshToken = await createRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: daysFromNow(7),
    },
  });

  return { user, accessToken, refreshToken };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    omit: { password: false },
  });

  if (!user) {
    throw new AuthError("Invalid email or password");
  }

  const valid = await argon2.verify(user.password, input.password);
  if (!valid) {
    throw new AuthError("Invalid email or password");
  }

  const accessToken = await createAccessToken(user.id, user.role);
  const refreshToken = await createRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: daysFromNow(7),
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
}

export async function cleanupExpiredTokens() {
  const { count } = await prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return count;
}