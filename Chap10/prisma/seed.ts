import { prisma } from "../src/db.js";

async function main() {
  console.log("Starting database seed...");

  // Clean existing records in reverse dependency order
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create Categories
  const techCategory = await prisma.category.create({
    data: { name: "Technology" },
  });

  const programmingCategory = await prisma.category.create({
    data: { name: "Programming" },
  });

  // Create Users with Profiles and Posts
  const user1 = await prisma.user.create({
    data: {
      username: "john_dev",
      email: "john@example.com",
      name: "John Doe",
      role: "ADMIN",
      profile: {
        create: {
          bio: "Senior TypeScript Engineer",
        },
      },
      posts: {
        create: [
          {
            title: "Getting Started with Prisma 7",
            content: "Prisma 7 introduces driver adapters and prisma.config.ts!",
            published: true,
            categories: {
              connect: [{ id: techCategory.id }, { id: programmingCategory.id }],
            },
          },
          {
            title: "Advanced TypeScript Patterns",
            content: "Draft in progress...",
            published: false,
          },
        ],
      },
    },
  });

  console.log(`Seeded user: ${user1.username} with ID ${user1.id}`);
  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });