export interface GlasgowInput {
  eyeOpening: 1 | 2 | 3 | 4;
  verbalResponse: 1 | 2 | 3 | 4 | 5;
  motorResponse: 1 | 2 | 3 | 4 | 5 | 6;
  pupillaryReactivity?: 0 | 1 | 2 | undefined;
}

export interface GlasgowResult {
  totalScore: number;
  gcsPScore?: number | undefined;
  severity: 'Trauma Cranioencefálico Grave' | 'Trauma Cranioencefálico Moderado' | 'Trauma Cranioencefálico Leve';
  recommendation: string;
  calculatedAt: string;
}
