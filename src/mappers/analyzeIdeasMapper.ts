export interface AnalyzeIdea {
  id: string;
  viability: string;
  marketPotential: string;
  innovation: string;
  challenges: string;
  suggestions: string;
  idea: string;
}

export const analyzeIdeasMap = (data: any): AnalyzeIdea => {
  return {
    id: data.id,
    viability: data.viability,
    marketPotential: data.marketPotential,
    innovation: data.innovation,
    challenges: data.challenges,
    suggestions: data.suggestions,
    idea: data.idea,
  };
};
