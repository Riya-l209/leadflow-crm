import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.discussion.deleteMany();
  await prisma.lead.deleteMany();

  const lead1 = await prisma.lead.create({
    data: {
      name: "Acme Corp",
      company: "Acme",
      phone: "9876543210",
      status: "CONTACTED",
    },
  });

  await prisma.discussion.createMany({
    data: [
      {
        leadId: lead1.id,
        note: "Initial outreach completed",
      },
      {
        leadId: lead1.id,
        note: "Follow-up call scheduled",
      },
    ],
  });

  await prisma.lead.createMany({
    data: [
      {
        name: "Globex",
        status: "NEW",
      },
      {
        name: "Innotech",
        status: "QUALIFIED",
      },
      {
        name: "Umbrella Corp",
        status: "PROPOSAL_SENT",
      },
      {
        name: "Wayne Enterprises",
        status: "WON",
      },
    ],
  });

  console.log("🌱 Seeded database");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });