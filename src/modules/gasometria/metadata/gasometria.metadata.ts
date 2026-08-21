export const gasometriaMetadata = {
  id: 'gasometria-arterial',
  name: 'Interpretação de Gasometria Arterial',
  version: '1.0.0',
  formulaVersion: 'Henderson-Hasselbalch e Relação PaO2/FiO2',
  reviewedAt: '2026-08-21',
  references: [
    {
      title: 'Blood Gas Analysis and Acid-Base Physiology',
      citation: 'West JB. Respiratory Physiology: The Essentials. 10th ed. Lippincott Williams & Wilkins; 2015.',
    },
  ],
  units: {
    ph: '',
    paco2: 'mmHg',
    hco3: 'mEq/L',
    pao2: 'mmHg',
    fio2: '%',
    be: 'mEq/L',
  },
  limits: {
    ph: { min: 6.5, max: 7.8 },
    paco2: { min: 10, max: 150 },
    hco3: { min: 2, max: 60 },
    pao2: { min: 10, max: 600 },
    fio2: { min: 21, max: 100 },
  },
};
