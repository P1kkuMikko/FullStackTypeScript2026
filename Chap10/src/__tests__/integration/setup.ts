import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export async function cleanDb() {
  // Delete in reverse order of foreign key dependencies
  await prisma.$transaction([
    prisma.post.deleteMany(),
    prisma.profile.deleteMany(),
    prisma.user.deleteMany(),
    prisma.category.deleteMany(),
  ]);
}