export interface IdeaEvaluation {
  viability: string;
  marketPotential: string;
  innovation: string;
  challenges: string;
  suggestions: string;
  fullText: string;
}

export function analizeMap(text: string): IdeaEvaluation {
  const getSection = (label: string) => {
    const regex = new RegExp(`${label}:\\s*(.*?)\\s*(?=\\d+\\.|$)`, "si");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    viability: getSection("1\\.\\s*Viabilidade Técnica"),
    marketPotential: getSection("2\\.\\s*Potencial de Mercado"),
    innovation: getSection("3\\.\\s*Inovação"),
    challenges: getSection("4\\.\\s*Possíveis Desafios"),
    suggestions: getSection("5\\.\\s*Sugestões de Melhoria"),
    fullText: text.trim(),
  };
}
