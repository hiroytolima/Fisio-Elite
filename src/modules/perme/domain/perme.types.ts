export interface PermeInput {
  mentalStatus: 0 | 1 | 2 | 3; // 0-3
  mobilityBarriers: 0 | 1 | 2; // 0-2
  functionalStrength: 0 | 1 | 2 | 3 | 4; // 0-4
  bedMobility: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0-6
  transfers: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // 0-8
  gait: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0-6
  endurance: 0 | 1 | 2 | 3; // 0-3
}

export interface PermeResult {
  totalScore: number;
  maxPossibleScore: number;
  mobilityLevel: 'low_mobility' | 'moderate_mobility' | 'high_mobility';
  clinicalSummary: string;
  calculatedAt: string;
}
