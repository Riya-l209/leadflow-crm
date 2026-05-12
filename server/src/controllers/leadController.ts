import { Request, Response } from "express";
import { z } from "zod";
import { leadService } from "../services/leadService";

const createLeadSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  phone: z.string().optional(),
});

const updateLeadSchema = z.object({
  status: z.string().optional(),
  followUpAt: z.string().datetime().nullable().optional(),
});

export const leadController = {
  async list(_req: Request, res: Response) {
    const leads = await leadService.getAllLeads();

    return res.json(leads);
  },

  async create(req: Request, res: Response) {
    const body = createLeadSchema.parse(req.body);

    const lead = await leadService.createLead(body);

    return res.status(201).json(lead);
  },

  async update(req: Request, res: Response) {
    const leadId = String(req.params.id);

    const body = updateLeadSchema.parse(req.body);

    const lead = await leadService.updateLead(leadId, {
      status: body.status,
      followUpAt: body.followUpAt
        ? new Date(body.followUpAt)
        : null,
    });

    return res.json(lead);
  },
};