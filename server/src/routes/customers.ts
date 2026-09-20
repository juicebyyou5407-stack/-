import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

export const customersRouter = Router();
customersRouter.use(requireAuth);

customersRouter.get("/", async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const customers = await prisma.customer.findMany({
    where: {
      organizationId: req.auth!.organizationId,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { nameKana: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { contracts: true } } },
  });
  res.json(customers);
});

customersRouter.get("/:id", async (req, res) => {
  const customer = await prisma.customer.findFirst({
    where: { id: req.params.id, organizationId: req.auth!.organizationId },
    include: {
      contracts: { orderBy: { startDate: "desc" } },
      activities: { orderBy: { createdAt: "desc" }, include: { user: { select: { name: true } } } },
    },
  });
  if (!customer) return res.status(404).json({ error: "顧客が見つかりません" });
  res.json(customer);
});

const customerSchema = z.object({
  name: z.string().min(1),
  nameKana: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  birthDate: z.string().optional(),
  memo: z.string().optional(),
});

customersRouter.post("/", async (req, res) => {
  const parsed = customerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data;
  const customer = await prisma.customer.create({
    data: {
      organizationId: req.auth!.organizationId,
      name: data.name,
      nameKana: data.nameKana || null,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      memo: data.memo || null,
    },
  });
  res.status(201).json(customer);
});

customersRouter.put("/:id", async (req, res) => {
  const parsed = customerSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const existing = await prisma.customer.findFirst({
    where: { id: req.params.id, organizationId: req.auth!.organizationId },
  });
  if (!existing) return res.status(404).json({ error: "顧客が見つかりません" });

  const data = parsed.data;
  const customer = await prisma.customer.update({
    where: { id: existing.id },
    data: {
      ...data,
      email: data.email === "" ? null : data.email,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    },
  });
  res.json(customer);
});

customersRouter.delete("/:id", async (req, res) => {
  const existing = await prisma.customer.findFirst({
    where: { id: req.params.id, organizationId: req.auth!.organizationId },
  });
  if (!existing) return res.status(404).json({ error: "顧客が見つかりません" });
  await prisma.customer.delete({ where: { id: existing.id } });
  res.status(204).send();
});
