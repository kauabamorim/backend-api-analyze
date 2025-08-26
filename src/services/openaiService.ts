import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process?.env?.OPENAI_API_KEY,
});

export async function analyzeIdeaWithAI(idea: string): Promise<string> {
  const prompt = `
Você é um consultor de startups com vasta experiência. Avalie a ideia de negócio abaixo com base nos seguintes critérios:

1. Viabilidade Técnica
2. Potencial de Mercado
3. Inovação
4. Possíveis Desafios
5. Sugestões de melhoria

Ideia: """${idea}"""
`;

  const response = await client.responses.create({
    model: "gpt-4",
    instructions: "Você é um consultor de negócios objetivo e direto.",
    input: prompt,
  });

  return response?.output_text?.trim() || "Sem resposta";
}
