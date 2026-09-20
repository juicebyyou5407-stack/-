import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";

export const authRouter = Router();

const registerSchema = z.object({
  organizationName: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

// Creates a brand-new agency (organization) with its first admin user.
authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { organizationName, name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "このメールアドレスは既に登録されています" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: { name: organizationName },
    });
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: "ADMIN",
        organizationId: organization.id,
      },
    });
    return { organization, user };
  });

  const token = signToken({
    userId: result.user.id,
    organizationId: result.organization.id,
    role: "ADMIN",
  });

  res.status(201).json({
    token,
    user: { id: result.user.id, name: result.user.name, email: result.user.email, role: result.user.role },
    organization: { id: result.organization.id, name: result.organization.name },
  });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { organization: true },
  });
  if (!user) {
    return res.status(401).json({ error: "メールアドレスまたはパスワードが違います" });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "メールアドレスまたはパスワードが違います" });
  }

  const token = signToken({
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role,
  });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    organization: { id: user.organization.id, name: user.organization.name },
  });
});
