export const hacorMetadata = {
  id: 'hacor-score',
  name: 'Escore HACOR (Predição de Falha de VNI na Insuficiência Respiratória Hipoxêmica)',
  version: '1.0.0',
  formulaVersion: 'Original (Duan et al., 2017)',
  reviewedAt: '2026-08-21',
  references: [
    {
      title: 'Assessment of heart rate, acidosis, consciousness, oxygenation, and respiratory rate to predict noninvasive ventilation failure in hypoxemic patients',
      citation: 'Duan J, Han X, Bai L, et al. Intensive Care Med. 2017;43(2):192-199.',
      doi: '10.1007/s00134-016-4601-3',
    },
  ],
  limits: {
    hr: { min: 20, max: 300 },
    ph: { min: 6.5, max: 7.8 },
    gcs: { min: 3, max: 15 },
    pao2Fio2: { min: 1, max: 1000 },
    rr: { min: 4, max: 80 },
  },
};
