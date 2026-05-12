import { Request, Response } from "express";
import { z } from "zod";
import { discussionService } from "../services/discussionService";

const createDiscussionSchema = z.object({
  note: z.string().min(1),
  followUpAt: z.string().datetime().optional(),
});

export const discussionController = {
  async list(req: Request, res: Response) {
    const leadId = String(req.params.id);

    const discussions =
      await discussionService.getLeadDiscussions(
        leadId
      );

    return res.json(discussions);
  },

  async create(req: Request, res: Response) {
    const leadId = String(req.params.id);

    const body = createDiscussionSchema.parse(req.body);

    const discussion =
      await discussionService.createDiscussion({
        leadId,
        note: body.note,
        followUpAt: body.followUpAt
          ? new Date(body.followUpAt)
          : undefined,
      });

    return res.status(201).json(discussion);
  },
};