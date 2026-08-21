export const roxMetadata = {
  id: 'rox-index',
  name: 'Índice ROX (Predictor de Falha da Cânula Nasal de Alto Fluxo)',
  version: '1.2.0',
  formulaVersion: 'Original (Roca et al., 2016)',
  reviewedAt: '2026-08-21',
  references: [
    {
      title: 'Predicting success of high-flow nasal cannula in pneumonia patients with hypoxemic respiratory failure: The utility of the ROX index',
      citation: 'Roca O, Messika J, Caralt B, et al. J Crit Care. 2016;35:200-205.',
      doi: '10.1016/j.jcrc.2016.05.022',
    },
  ],
  units: {
    spo2: '%',
    fio2: '%',
    rr: 'irpm',
  },
  limits: {
    spo2: { min: 50, max: 100 },
    fio2: { min: 21, max: 100 },
    rr: { min: 4, max: 80 },
  },
};
