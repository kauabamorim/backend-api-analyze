import express from "express";
import { analyzeIdeaWithAI } from "../services/openaiService";
import { analizeMap } from "../mappers/analyzeMapper";
import z from "zod";
import { Plan, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

const limits = {
  FREE: 5,
  STARTER: 10,
  PRO: 50,
  ENTERPRISE: Infinity,
};

const analyzeSchema = z.object({
  idea: z.string().min(1, "Idea é obrigatória."),
});

router.post("/", async (req, res) => {
  const parseResult = analyzeSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request body.",
      issues: parseResult.error.errors,
    });
  }

  const { idea } = parseResult.data;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const ideaCount = await prisma.idea.count({
      where: { userId: user.id },
    });

    const userPlan = user.plan || Plan.FREE;
    const allowed = limits[userPlan];

    if (ideaCount >= allowed) {
      return res
        .status(403)
        .json({ error: "Limite de ideias atingido para seu plano." });
    }

    const analysis = await analyzeIdeaWithAI(idea);
    if (!analysis) {
      return res.status(500).json({ error: "Falha ao analisar a ideia." });
    }

    const mappedAnalysis = analizeMap(analysis);

    await prisma.idea.create({
      data: {
        content: idea,
        feedback: JSON.parse(JSON.stringify(mappedAnalysis)),
        userId: user.id,
      },
    });

    res.status(200).json({ mappedAnalysis });
  } catch (error) {
    console.error("Error analyzing idea:", error);
    res.status(500).json({ error: "Falha ao analisar a ideia." });
  }
});

export default router;
