import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "";

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email e senha são obrigatórios." });

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
        name: `${firstName} ${lastName}` || email?.split("@")[0],
        createdAt: new Date(),
      },
    });

    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    console.log("Erro ao criar usuário:", error);
    res.status(400).json({ error: "Erro ao criar usuário" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email e senha são obrigatórios." });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Email ou senha inválidos." });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: "Email ou senha inválidos." });

    const token = jwt.sign(
      { userId: user.id, plan: user.plan, name: user.name },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token });
  } catch (error) {
    console.log("Error route login:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

export default router;
