import bcrypt from "bcryptjs";
import { Plan, PrismaClient, Role, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password@123", 10);

  const [everest, lumbini] = await Promise.all([
    prisma.institution.upsert({
      where: { slug: "everest-academy" },
      update: {},
      create: {
        name: "Everest Academy",
        slug: "everest-academy",
        phone: "+9779800000001",
        address: "Kathmandu, Nepal",
      },
    }),
    prisma.institution.upsert({
      where: { slug: "lumbini-college" },
      update: {},
      create: {
        name: "Lumbini College",
        slug: "lumbini-college",
        phone: "+9779800000002",
        address: "Butwal, Nepal",
      },
    }),
  ]);

  await Promise.all([
    prisma.user.upsert({
      where: { email: "owner@everest.edu.np" },
      update: {},
      create: {
        name: "Everest Owner",
        email: "owner@everest.edu.np",
        passwordHash,
        role: Role.OWNER,
        institutionId: everest.id,
      },
    }),
    prisma.user.upsert({
      where: { email: "owner@lumbini.edu.np" },
      update: {},
      create: {
        name: "Lumbini Owner",
        email: "owner@lumbini.edu.np",
        passwordHash,
        role: Role.OWNER,
        institutionId: lumbini.id,
      },
    }),
  ]);

  await Promise.all([
    prisma.subscription.create({
      data: {
        institutionId: everest.id,
        plan: Plan.PRO,
        status: SubscriptionStatus.ACTIVE,
      },
    }),
    prisma.subscription.create({
      data: {
        institutionId: lumbini.id,
        plan: Plan.BASIC,
        status: SubscriptionStatus.ACTIVE,
      },
    }),
  ]);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
