export interface AnalyzeIdea {
  author: string;
  id: string;
  viability: string;
  marketPotential: string;
  innovation: string;
  challenges: string;
  suggestions: string;
  idea: string;
  status: string;
}

export const analyzeIdeasMap = (data: any): AnalyzeIdea => {
  return {
    author: data.author,
    id: data.id,
    viability: data.viability,
    marketPotential: data.marketPotential,
    innovation: data.innovation,
    challenges: data.challenges,
    suggestions: data.suggestions,
    idea: data.idea,
    status: data.status,
  };
};
