export type VasopressorOption =
  | 'none'
  | 'dobutamine'
  | 'dopamine_low'
  | 'dopamine_med'
  | 'dopamine_high'
  | 'norepinephrine_low'
  | 'norepinephrine_high';

export interface SofaInput {
  pao2Fio2: number;
  platelets: number;
  bilirubin: number;
  map: number;
  vasopressors: VasopressorOption;
  glasgow: number;
  creatinine: number;
  urineOutput: number;
}

export interface SofaResult {
  totalScore: number;
  breakdown: {
    respiration: number;
    coagulation: number;
    liver: number;
    cardiovascular: number;
    cns: number;
    renal: number;
  };
  mortalityRisk: string;
  calculatedAt: string;
}
