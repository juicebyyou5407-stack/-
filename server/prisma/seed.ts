import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const org = await prisma.organization.create({
    data: { name: "サンプル共済代理店" },
  });

  const admin = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: "管理者 太郎",
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  const customer = await prisma.customer.create({
    data: {
      organizationId: org.id,
      name: "山田 花子",
      nameKana: "ヤマダ ハナコ",
      phone: "090-1234-5678",
      email: "hanako@example.com",
      address: "東京都千代田区1-1-1",
    },
  });

  await prisma.contract.create({
    data: {
      organizationId: org.id,
      customerId: customer.id,
      productName: "生命共済",
      status: "ACTIVE",
      premiumAmount: 3000,
      paymentCycle: "月払",
      startDate: new Date("2024-04-01"),
      renewalDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.activity.create({
    data: {
      organizationId: org.id,
      customerId: customer.id,
      userId: admin.id,
      type: "電話",
      content: "更新案内の連絡を実施",
    },
  });

  console.log("Seed complete. Login with admin@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
