import { timingSafeEqual } from "crypto";
import type { NextFunction, Request, Response } from "express";

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_TOKEN;
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !token || !safeEqual(token, expected)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
