import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "";

const JwtPayloadSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  plan: z.string(),
  name: z.string(),
});

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    const result = JwtPayloadSchema.safeParse(payload);

    if (!result.success) {
      return res
        .status(400)
        .json({ error: "Payload inválido", issues: result.error.errors });
    }

    (req as any).user = result.data;
    next();
  });
}
