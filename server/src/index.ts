import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { customersRouter } from "./routes/customers";
import { contractsRouter } from "./routes/contracts";
import { activitiesRouter } from "./routes/activities";
import { membersRouter } from "./routes/members";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/customers", customersRouter);
app.use("/contracts", contractsRouter);
app.use("/activities", activitiesRouter);
app.use("/members", membersRouter);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`kyosai-crm-server listening on port ${port}`);
});
