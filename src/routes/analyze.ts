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

    const analysis = `1. Viabilidade Técnica:\n   Esta ideia é tecnicamente viável, assumindo acesso a programadores e especialistas em IA. Existem várias plataformas de aprendizado adaptativo no mercado, muitas das quais utilizam alguma forma de IA. Experts em IA e educadores podem iterar e melhorar continuamente o modelo conforme os dados coletados aumentam.\n\n2. Potencial de Mercado:\n   Há um mercado amplo e crescente para soluções de educação online personalizadas. De estudantes motivados a profissionais que buscam aprimoramento contínuo, os clientes potenciais são vastos. A demanda por educação virtual cresceu consideravelmente, especialmente durante a pandemia da COVID-19 e tende a continuar crescendo no futuro.\n\n3. Inovação:\n   Embora a ideia de educação personalizada e online não seja nova e existem vários players no mercado fornecendo soluções semelhantes, a inclusão de tutores virtuais e a integração com ferramentas de produtividade podem fornecer um diferencial competitivo.\n\n4. Possíveis Desafios:\n   Entre os desafios estão: Desenvolver um algoritmo de IA que seja verdadeiramente eficaz na personalização de planos de estudo; Incluir uma ampla gama de materiais didáticos para atender estudantes de diferentes níveis; Manter o engajamento dos usuários a longo prazo; Garantir a privacidade e segurança dos dados dos alunos; E por último, bastante competitivo, pois já existem várias plataformas de aprendizado adaptativo.\n\n5. Sugestões de Melhoria:\n   Para melhorar a ideia, você poderia considerar uma estratégia de gamificação mais forte para aumentar o engajamento dos usuários. Além disso, em vez de tentar atender a todos os níveis, você pode querer começar com um nicho específico e expandir a partir daí. Considere parcerias estratégicas com escolas e universidades para aumentar a adoção. Por último, é essencial implementar fortes medidas de segurança e privacidade desde o início.`;
    if (!analysis) {
      return res.status(500).json({ error: "Falha ao analisar a ideia." });
    }

    const createdIdea = await prisma.idea.create({
      data: {
        idea,
        userId: user.id,
      },
    });

    ideaId = createdIdea.id;

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

export default router;
