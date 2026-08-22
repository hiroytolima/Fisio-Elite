export interface PermeInput {
  mentalStatus: 0 | 1 | 2 | 3; // 0-3
  mobilityBarriers: 0 | 1 | 2; // 0-2
  functionalStrength: 0 | 1 | 2 | 3; // 0-3
  bedMobility: 0 | 1 | 2 | 3; // 0-3
  transfers: 0 | 1 | 2 | 3 | 4 | 5; // 0-5
  gait: 0 | 1 | 2 | 3; // 0-3
  endurance: 0 | 1 | 2 | 3; // 0-3
}

export interface PermeResult {
  totalScore: number;
  maxPossibleScore: number;
  mobilityLevel: 'low_mobility' | 'moderate_mobility' | 'high_mobility';
  clinicalSummary: string;
  calculatedAt: string;
}
