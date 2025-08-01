import express from "express";
import { analyzeIdeaWithAI } from "../services/openaiService";
import { analizeMap } from "../mappers/analyzeMapper";
import z from "zod";

const router = express.Router();

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

  try {
    const analysis = await analyzeIdeaWithAI(idea);
    if (!analysis) {
      return res.status(500).json({ error: "Falha ao analisar a ideia." });
    }
    const mappedAnalysis = analizeMap(analysis);
    res.json({ mappedAnalysis });
  } catch (error) {
    console.error("Error analyzing idea:", error);
    res.status(500).json({ error: "Falha ao analisar a ideia." });
  }
});

export default router;
