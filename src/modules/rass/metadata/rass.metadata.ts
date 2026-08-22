import { ClinicalMetadata } from '../../sofa/metadata/sofa.metadata';

export const rassMetadata: ClinicalMetadata = {
  id: 'rass-scale',
  name: 'Richmond Agitation-Sedation Scale (RASS)',
  version: '1.0.0',
  formulaVersion: 'Sessler et al., 2002',
  reviewedAt: '2026-08-21',
  references: [
    {
      title: 'The Richmond Agitation-Sedation Scale: validity and reliability in adult intensive care unit patients',
      citation: 'Sessler CN, Gosnell MS, Grap MJ, et al. Am J Respir Crit Care Med. 2002;166(10):1338-1344.',
      doi: '10.1164/rccm.2107013',
    },
  ],
  units: {
    score: 'pontos',
  },
  limits: {
    score: { min: -5, max: 4 },
  },
};
