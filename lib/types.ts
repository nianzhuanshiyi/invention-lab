export interface Invention {
  id: string;
  title: string;
  tagline: string;
  trend: string;
  trendSource: string;
  painPoint: string;
  solution: string;
  category: string;
  status: string;
  score: number;
  imagePrompt?: string | null;
  imageUrl?: string | null;
  marketSize?: string | null;
  targetPrice?: string | null;
  highlights: string[];
  votes: number;
  createdAt: string;
}

export interface GenerateRequest {
  topic: string;
}

export interface TrendItem {
  keyword: string;
  traffic: string;
  region: string;
  relatedQueries: string[];
}
