import { Request, Response } from "express";

import { prisma } from "../utils/prisma";

export const discussionController = {
  async list(
    req: Request,
    res: Response
  ) {
    try {
      const leadId =
        req.params.id as string;

      const discussions =
        await prisma.discussion.findMany({
          where: {
            leadId,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      return res.json(
        discussions
      );
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            "Failed to fetch discussions",
        });
    }
  },

  async create(
    req: Request,
    res: Response
  ) {
    try {
      const leadId =
        req.params.id as string;

      const {
        note,
        followUpAt,
      } = req.body;

      if (!note) {
        return res
          .status(400)
          .json({
            error:
              "Note is required",
          });
      }

      const discussion =
        await prisma.discussion.create({
          data: {
            leadId,
            note,

            followUpAt:
              followUpAt
                ? new Date(
                    followUpAt
                  )
                : null,
          },
        });

      // UPDATE LEAD FOLLOW-UP
      if (followUpAt) {
        await prisma.lead.update({
          where: {
            id: leadId,
          },

          data: {
            followUpAt:
              new Date(
                followUpAt
              ),
          },
        });
      }

      return res
        .status(201)
        .json(discussion);
    } catch (error) {
      console.error(
        "DISCUSSION CREATE ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to create discussion",
        });
    }
  },
};