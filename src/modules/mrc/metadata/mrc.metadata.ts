import { ClinicalMetadata } from '../../sofa/metadata/sofa.metadata';

export const mrcMetadata: ClinicalMetadata = {
  id: 'mrc-sum-score',
  name: 'MRC Sum-Score (Medical Research Council - Muscle Strength)',
  version: '1.0.0',
  formulaVersion: 'Kleyweg et al., 1991 / De Jonghe et al., 2002',
  reviewedAt: '2026-08-21',
  references: [
    {
      title: 'Paresis acquired in the intensive care unit: a prospective multicenter study',
      citation: 'De Jonghe B, Sharshar T, Lefaucheur JP, et al. JAMA. 2002;288(22):2859-2867.',
      doi: '10.1001/jama.288.22.2859',
    },
  ],
  units: {
    totalScore: 'pontos (0-60)',
  },
  limits: {
    totalScore: { min: 0, max: 60 },
  },
};
