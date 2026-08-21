export interface ClinicalMetadata {
  id: string;
  name: string;
  version: string;
  formulaVersion: string;
  reviewedAt: string;
  references: { title: string; citation: string; doi?: string }[];
  units: Record<string, string>;
  limits: Record<string, { min: number; max: number }>;
}

export const sofaMetadata: ClinicalMetadata = {
  id: 'sofa-score',
  name: 'Sequential Organ Failure Assessment (SOFA)',
  version: '1.0.0',
  formulaVersion: 'Original (Vincent et al., 1996)',
  reviewedAt: '2026-08-21',
  references: [
    {
      title: 'The SOFA (Sepsis-related Organ Failure Assessment) score to describe organ dysfunction/failure',
      citation: 'Vincent JL, Moreno R, Takala J, et al. Intensive Care Med. 1996;22(7):707-710.',
      doi: '10.1007/BF01709751',
    },
  ],
  units: {
    pao2Fio2: 'mmHg',
    platelets: 'x10³/µL',
    bilirubin: 'mg/dL',
    map: 'mmHg',
    creatinine: 'mg/dL',
    urineOutput: 'mL/dia',
  },
  limits: {
    pao2Fio2: { min: 1, max: 1000 },
    platelets: { min: 0, max: 2000 },
    bilirubin: { min: 0, max: 100 },
    map: { min: 0, max: 300 },
    glasgow: { min: 3, max: 15 },
    creatinine: { min: 0, max: 30 },
    urineOutput: { min: 0, max: 10000 },
  },
};
