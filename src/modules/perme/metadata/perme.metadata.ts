import { ClinicalMetadata } from '../../sofa/metadata/sofa.metadata';

export const permeMetadata: ClinicalMetadata = {
  id: 'perme-icu-score',
  name: 'Perme ICU Mobility Score',
  version: '1.0.0',
  formulaVersion: 'Perme et al., 2014',
  reviewedAt: '2026-08-21',
  references: [
    {
      title: 'A tool to assess mobility status in critically ill patients: The Perme ICU Mobility Score',
      citation: 'Perme C, Nawa RK, Winkelman C, Masud F. Methodist Debakey Cardiovasc J. 2014;10(1):41-49.',
      doi: '10.14797/mdcj-10-1-41',
    },
  ],
  units: {
    totalScore: 'pontos (0-32)',
  },
  limits: {
    totalScore: { min: 0, max: 32 },
  },
};
