import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireAdmin } from "../middleware/auth";

export const membersRouter = Router();
membersRouter.use(requireAuth);

// Any authenticated member of the agency can see the roster.
membersRouter.get("/", async (req, res) => {
  const members = await prisma.user.findMany({
    where: { organizationId: req.auth!.organizationId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  res.json(members);
});

const inviteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
});

// Only an agency admin can add new staff accounts.
membersRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = inviteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "このメールアドレスは既に登録されています" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role, organizationId: req.auth!.organizationId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  res.status(201).json(user);
});

membersRouter.delete("/:id", requireAdmin, async (req, res) => {
  if (req.params.id === req.auth!.userId) {
    return res.status(400).json({ error: "自分自身は削除できません" });
  }
  const existing = await prisma.user.findFirst({
    where: { id: req.params.id, organizationId: req.auth!.organizationId },
  });
  if (!existing) return res.status(404).json({ error: "メンバーが見つかりません" });
  await prisma.user.delete({ where: { id: existing.id } });
  res.status(204).send();
});
