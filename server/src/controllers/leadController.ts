import { Request, Response } from "express";

import { prisma } from "../utils/prisma";

export const leadController = {
  async list(_req: Request, res: Response) {
    try {
      const leads =
        await prisma.lead.findMany({
          include: {
            discussions: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      return res.json(leads);
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            "Failed to fetch leads",
        });
    }
  },

  async create(
    req: Request,
    res: Response
  ) {
    try {
      const {
        name,
        company,
        phone,
      } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({
            error:
              "Name is required",
          });
      }

      const lead =
        await prisma.lead.create({
          data: {
            name,
            company,
            phone,
            status: "NEW",
          },
        });

      return res
        .status(201)
        .json(lead);
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          error:
            "Failed to create lead",
        });
    }
  },

  async update(
    req: Request,
    res: Response
  ) {
    try {
      const id =
        req.params.id as string;

      const status =
        req.body.status;

      console.log(
        "Updating lead:",
        id,
        status
      );

      const updatedLead =
        await prisma.lead.update({
          where: {
            id,
          },

          data: {
            status,
          },
        });

      return res.json(
        updatedLead
      );
    } catch (error) {
      console.error(
        "UPDATE ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to update lead",
        });
    }
  },
};