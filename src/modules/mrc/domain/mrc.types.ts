export type MrcScoreValue = 0 | 1 | 2 | 3 | 4 | 5;

export interface MrcGroupScores {
  shoulderAbductionRight: MrcScoreValue;
  shoulderAbductionLeft: MrcScoreValue;
  elbowFlexionRight: MrcScoreValue;
  elbowFlexionLeft: MrcScoreValue;
  wristExtensionRight: MrcScoreValue;
  wristExtensionLeft: MrcScoreValue;
  hipFlexionRight: MrcScoreValue;
  hipFlexionLeft: MrcScoreValue;
  kneeExtensionRight: MrcScoreValue;
  kneeExtensionLeft: MrcScoreValue;
  ankleDorsiflexionRight: MrcScoreValue;
  ankleDorsiflexionLeft: MrcScoreValue;
}

export interface MrcInput {
  scores: MrcGroupScores;
}

export interface MrcResult {
  totalScore: number;
  maxPossibleScore: number;
  upperLimbsScore: number;
  lowerLimbsScore: number;
  hasIcuAcquiredWeakness: boolean;
  classification: 'severe_weakness' | 'icu_acquired_weakness' | 'normal_strength';
  clinicalSummary: string;
  calculatedAt: string;
}
