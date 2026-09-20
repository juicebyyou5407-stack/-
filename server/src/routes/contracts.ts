import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const contractsRouter = Router();
contractsRouter.use(requireAuth);

contractsRouter.get("/", async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const contracts = await prisma.contract.findMany({
    where: {
      organizationId: req.auth!.organizationId,
      ...(status ? { status: status as any } : {}),
    },
    orderBy: { renewalDate: "asc" },
    include: { customer: { select: { id: true, name: true } } },
  });
  res.json(contracts);
});

// Contracts renewing within the next N days (default 30), for dashboard alerts.
contractsRouter.get("/renewals/upcoming", async (req, res) => {
  const days = Number(req.query.days ?? 30);
  const now = new Date();
  const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const contracts = await prisma.contract.findMany({
    where: {
      organizationId: req.auth!.organizationId,
      status: "ACTIVE",
      renewalDate: { gte: now, lte: until },
    },
    orderBy: { renewalDate: "asc" },
    include: { customer: { select: { id: true, name: true, phone: true } } },
  });
  res.json(contracts);
});

contractsRouter.get("/:id", async (req, res) => {
  const contract = await prisma.contract.findFirst({
    where: { id: req.params.id, organizationId: req.auth!.organizationId },
    include: { customer: { select: { id: true, name: true } } },
  });
  if (!contract) return res.status(404).json({ error: "契約が見つかりません" });
  res.json(contract);
});

const contractSchema = z.object({
  customerId: z.string().min(1),
  productName: z.string().min(1),
  contractNumber: z.string().optional(),
  status: z.enum(["ACTIVE", "PENDING", "CANCELLED", "EXPIRED"]).optional(),
  premiumAmount: z.number().int().optional(),
  paymentCycle: z.string().optional(),
  startDate: z.string().min(1),
  renewalDate: z.string().optional(),
  memo: z.string().optional(),
});

contractsRouter.post("/", async (req, res) => {
  const parsed = contractSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data;

  const customer = await prisma.customer.findFirst({
    where: { id: data.customerId, organizationId: req.auth!.organizationId },
  });
  if (!customer) return res.status(404).json({ error: "顧客が見つかりません" });

  const contract = await prisma.contract.create({
    data: {
      organizationId: req.auth!.organizationId,
      customerId: data.customerId,
      productName: data.productName,
      contractNumber: data.contractNumber || null,
      status: data.status ?? "ACTIVE",
      premiumAmount: data.premiumAmount ?? null,
      paymentCycle: data.paymentCycle || null,
      startDate: new Date(data.startDate),
      renewalDate: data.renewalDate ? new Date(data.renewalDate) : null,
      memo: data.memo || null,
    },
  });
  res.status(201).json(contract);
});

contractsRouter.put("/:id", async (req, res) => {
  const parsed = contractSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const existing = await prisma.contract.findFirst({
    where: { id: req.params.id, organizationId: req.auth!.organizationId },
  });
  if (!existing) return res.status(404).json({ error: "契約が見つかりません" });

  const data = parsed.data;
  const contract = await prisma.contract.update({
    where: { id: existing.id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      renewalDate: data.renewalDate ? new Date(data.renewalDate) : undefined,
      cancelledAt: data.status === "CANCELLED" ? new Date() : undefined,
    },
  });
  res.json(contract);
});

contractsRouter.delete("/:id", async (req, res) => {
  const existing = await prisma.contract.findFirst({
    where: { id: req.params.id, organizationId: req.auth!.organizationId },
  });
  if (!existing) return res.status(404).json({ error: "契約が見つかりません" });
  await prisma.contract.delete({ where: { id: existing.id } });
  res.status(204).send();
});
