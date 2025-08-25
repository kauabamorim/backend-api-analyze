import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { analyzeIdeasMap } from "../mappers/analyzeIdeasMapper";

const prisma = new PrismaClient();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "";

const registerSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  firstName: z.string().min(1, "O primeiro nome é obrigatório."),
  lastName: z.string().min(1, "O sobrenome é obrigatório."),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

router.post("/register", async (req, res) => {
  const parseResult = registerSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos.", issues: parseResult.error.errors });
  }

  const { email, password, firstName, lastName } = parseResult.data;

  const name = `${firstName} ${lastName}`;

  const checkExistUser = await prisma.user.findUnique({
    where: { email },
  });

  if (checkExistUser) {
    return res.status(400).json({ error: "Usuário já existe." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    res.status(201).json({ message: "Usuário registrado com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

router.post("/login", async (req, res) => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: "Dados inválidos.", issues: parseResult.error.errors });
  }

  const { email, password } = parseResult.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, plan: user.plan, name: user.name },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login." });
  }
});

router.get("/history", async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  try {
    const ideas = await prisma.idea.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const mappedIdeas = ideas.map((idea) => {
      return analyzeIdeasMap(idea);
    });

    console.log(`userId ${userId} History Length: `, mappedIdeas.length);
    res.json(mappedIdeas);
  } catch (error) {
    console.error("Erro ao buscar histórico de ideias:", error);
    res.status(500).json({ error: "Erro ao buscar histórico de ideias." });
  }
});

export default router;
