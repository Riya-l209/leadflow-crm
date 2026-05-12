import { prisma } from "../utils/prisma";

export const leadService = {
  async getAllLeads() {
    return prisma.lead.findMany({
      include: {
        discussions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  async createLead(data: {
    name: string;
    company?: string;
    phone?: string;
  }) {
    return prisma.lead.create({
      data: {
        name: data.name,
        company: data.company,
        phone: data.phone,
        status: "NEW",
      },
    });
  },

  async updateLead(
    id: string,
    data: {
      status?: string;
      followUpAt?: Date | null;
    }
  ) {
    return prisma.lead.update({
      where: { id },
      data,
    });
  },
};