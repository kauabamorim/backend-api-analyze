import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "";

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email e senha são obrigatórios" });

  const checkExistUser = await prisma.user.findUnique({
    where: { email },
  });

  if (checkExistUser) {
    return res.status(400).json({ error: "Usuário já existe" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        createdAt: new Date(),
      },
      select: {
        id: true,
        plan: true,
      },
    });

    const token = jwt.sign({ userId: user.id, plan: user.plan }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "Usuário criado com sucesso", token });
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar usuário" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email e senha são obrigatórios" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Usuário ou senha inválidos" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: "Usuário ou senha inválidos" });

    const token = jwt.sign({ userId: user.id, plan: user.plan }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch {
    res.status(500).json({ error: "Erro no servidor" });
  }
});

export default router;
