import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}
const JWT_SECRET: string = process.env.JWT_SECRET;

export type TokenPayload = {
  userId: string;
  organizationId: string;
  role: "ADMIN" | "STAFF";
};

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
