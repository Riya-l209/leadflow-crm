import { prisma } from "../utils/prisma";

export const discussionService = {
  async getLeadDiscussions(leadId: string) {
    return prisma.discussion.findMany({
      where: { leadId },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async createDiscussion(data: {
    leadId: string;
    note: string;
    followUpAt?: Date;
  }) {
    const discussion = await prisma.discussion.create({
      data,
    });

    if (data.followUpAt) {
      await prisma.lead.update({
        where: {
          id: data.leadId,
        },
        data: {
          followUpAt: data.followUpAt,
        },
      });
    }

    return discussion;
  },
};