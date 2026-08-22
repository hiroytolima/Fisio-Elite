import { ClinicalMetadata } from '../../sofa/metadata/sofa.metadata';

export const camIcuMetadata: ClinicalMetadata = {
  id: 'cam-icu-algorithm',
  name: 'CAM-ICU (Confusion Assessment Method for the ICU)',
  version: '1.0.0',
  formulaVersion: 'Ely et al., 2001',
  reviewedAt: '2026-08-21',
  references: [
    {
      title: 'Delirium in mechanically ventilated patients: validity and reliability of the Confusion Assessment Method for the Intensive Care Unit (CAM-ICU)',
      citation: 'Ely EW, Inouye SK, Bernard GR, et al. JAMA. 2001;286(21):2703-2710.',
      doi: '10.1001/jama.286.21.2703',
    },
  ],
  units: {},
  limits: {},
};
