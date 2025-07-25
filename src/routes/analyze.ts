import express from "express";
import { analyzeIdeaWithAI } from "../services/openaiService";
import { analizeMap } from "../mappers/analyzeMapper";

const router = express.Router();

router.post("/", async (req, res) => {
  const { idea } = req.body || {};

  if (!idea) {
    return res.status(400).json({ error: "Idea is required." });
  }

  try {
    const analysis = await analyzeIdeaWithAI(idea);
    if (!analysis) {
      return res.status(500).json({ error: "Failed to analyze the idea." });
    }
    const mappedAnalysis = analizeMap(analysis);
    res.json({ mappedAnalysis });
  } catch (error) {
    console.error("Error analyzing idea:", error);
    res.status(500).json({ error: "Failed to analyze the idea." });
  }
});

export default router;
