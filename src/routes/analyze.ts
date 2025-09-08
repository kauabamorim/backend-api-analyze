import express from "express";
import { analyzeIdeaWithAI } from "../services/openaiService";
import { analizeMap, analyzeIdeasMap } from "../mappers/analyzeMapper";
import z from "zod";
import { Plan, PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma";

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

const idSchema = z.string().min(1, "ID é obrigatório.");

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

  let ideaId: string | null = null;
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

    const userPlan = user.plan || Plan.FREE;
    const allowed = limits[userPlan];

    const whereCondition: any = {
      userId: user.id,
    };

    if (userPlan !== "FREE") {
      whereCondition.createdAt = {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      };
    }

    const ideaCount = await prisma.idea.count({
      where: whereCondition,
    });

    if (ideaCount >= allowed) {
      return res
        .status(403)
        .json({ error: "Limite de ideias atingido para seu plano." });
    }

    const createdIdea = await prisma.idea.create({
      data: {
        author: user.name,
        idea,
        userId: user.id,
      },
    });

    ideaId = createdIdea.id;

    const analysis = await analyzeIdeaWithAI(idea);

    if (!analysis) {
      return res.status(500).json({ error: "Falha ao analisar a ideia." });
    }

    const mappedAnalysis = analizeMap(analysis);

    await prisma.idea.update({
      where: { id: ideaId },
      data: {
        viability: mappedAnalysis.viability,
        marketPotential: mappedAnalysis.marketPotential,
        innovation: mappedAnalysis.innovation,
        challenges: mappedAnalysis.challenges,
        suggestions: mappedAnalysis.suggestions,
        status: "COMPLETED",
      },
    });

    res.status(200).json({ mappedAnalysis });
  } catch (error) {
    console.error("Error analyzing idea:", error);
    if (ideaId) {
      console.log("Setting idea status to ERROR for ideaId:", ideaId);
      await prisma.idea.update({
        where: { id: ideaId },
        data: {
          status: "ERROR",
        },
      });
    }
    res.status(500).json({ error: "Falha ao analisar a ideia." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const parseResult = idSchema.safeParse(id);

  if (!parseResult.success) {
    return res.status(400).json({
      error: "ID inválido.",
      issues: parseResult.error.errors,
    });
  }

  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado." });
  }

  try {
    const idea = await prisma.idea.findUnique({
      where: { id },
    });

    if (!idea) {
      return res.status(404).json({ error: "Ideia não encontrada." });
    }

    if (idea.userId !== userId) {
      return res.status(403).json({ error: "Acesso negado a esta ideia." });
    }

    res.status(200).json(analyzeIdeasMap(idea));
  } catch (error) {
    console.error("Error analyzing ID idea:", error);
    res.status(500).json({ error: "Falha ao analisar a ideia." });
  }
});

export default router;
