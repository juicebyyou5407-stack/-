import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "認証が必要です" });
  }
  try {
    req.auth = verifyToken(header.slice("Bearer ".length));
    next();
  } catch {
    return res.status(401).json({ error: "トークンが無効です" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.role !== "ADMIN") {
    return res.status(403).json({ error: "管理者権限が必要です" });
  }
  next();
}
