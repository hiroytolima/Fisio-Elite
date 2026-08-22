export type RassScore = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4;

export interface RassInput {
  score: RassScore;
}

export interface RassResult {
  score: RassScore;
  term: string;
  description: string;
  classification: 'sedated' | 'alert_calm' | 'agitated';
  clinicalRecommendation: string;
  calculatedAt: string;
}
