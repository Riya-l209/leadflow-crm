import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.discussion.deleteMany();
  await prisma.lead.deleteMany();

  const lead1 = await prisma.lead.create({
    data: {
      name: "Sarah Connor",
      company: "Acme Corp",
      phone: "555-0199",
      status: "PROPOSAL_SENT",
      followUpAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      discussions: {
        create: [
          {
            note: "Lead created via web form.",
          },
          {
            note:
              "Initial discovery call. They need a CRM for 50 reps.",
          },
          {
            note:
              "Sent pricing tier PDF. Said she would review with her boss.",
          },
        ],
      },
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      name: "Hank Scorpio",
      company: "Globex",
      status: "NEW",
      discussions: {
        create: [
          {
            note: "Inbound lead from website contact form.",
          },
        ],
      },
    },
  });

  const lead3 = await prisma.lead.create({
    data: {
      name: "Bill Lumbergh",
      company: "Initech",
      status: "CONTACTED",
      discussions: {
        create: [
          {
            note: "Left voicemail with his assistant.",
          },
        ],
      },
    },
  });

  const lead4 = await prisma.lead.create({
    data: {
      name: "Bruce Wayne",
      company: "Wayne Enterprises",
      status: "WON",
      discussions: {
        create: [
          {
            note: "Contract signed. Sending welcome package.",
          },
        ],
      },
    },
  });

  const lead5 = await prisma.lead.create({
    data: {
      name: "Diana Prince",
      company: "Themyscira Labs",
      status: "QUALIFIED",
      followUpAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      discussions: {
        create: [
          {
            note: "Interested in enterprise AI workflow automation.",
          },
        ],
      },
    },
  });

  console.log("Seed data inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });