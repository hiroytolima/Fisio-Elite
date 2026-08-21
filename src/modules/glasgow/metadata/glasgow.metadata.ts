export const glasgowMetadata = {
  id: 'glasgow-coma-scale',
  name: 'Escala de Coma de Glasgow com Reatividade Pupilar (GCS-P)',
  version: '2.0.0',
  formulaVersion: 'Atualização Teasdale et al. (2018)',
  reviewedAt: '2026-08-21',
  references: [
    {
      title: 'Resuscitating the Glasgow Coma Scale',
      citation: 'Teasdale G, Maas A, Lecky F, et al. BMJ. 2014;348:g1046.',
      doi: '10.1136/bmj.g1046',
    },
    {
      title: 'The Glasgow Coma Scale at 40 years: standing the test of time',
      citation: 'Teasdale G, Andrew E, Brennan P, et al. Lancet Neurol. 2014;13(8):844-854.',
    },
  ],
  limits: {
    eyeOpening: { min: 1, max: 4 },
    verbalResponse: { min: 1, max: 5 },
    motorResponse: { min: 1, max: 6 },
    pupillaryReactivity: { min: 0, max: 2 },
  },
};
