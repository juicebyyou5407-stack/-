import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const activitiesRouter = Router();
activitiesRouter.use(requireAuth);

const activitySchema = z.object({
  customerId: z.string().min(1),
  type: z.string().min(1),
  content: z.string().min(1),
});

activitiesRouter.post("/", async (req, res) => {
  const parsed = activitySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data;

  const customer = await prisma.customer.findFirst({
    where: { id: data.customerId, organizationId: req.auth!.organizationId },
  });
  if (!customer) return res.status(404).json({ error: "顧客が見つかりません" });

  const activity = await prisma.activity.create({
    data: {
      organizationId: req.auth!.organizationId,
      customerId: data.customerId,
      userId: req.auth!.userId,
      type: data.type,
      content: data.content,
    },
  });
  res.status(201).json(activity);
});

activitiesRouter.delete("/:id", async (req, res) => {
  const existing = await prisma.activity.findFirst({
    where: { id: req.params.id, organizationId: req.auth!.organizationId },
  });
  if (!existing) return res.status(404).json({ error: "履歴が見つかりません" });
  await prisma.activity.delete({ where: { id: existing.id } });
  res.status(204).send();
});
