export interface CamIcuInput {
  /** Feature 1: Alteração aguda no estado mental ou curso flutuante */
  acuteOnsetOrFluctuating: boolean;
  /** Feature 2: Inatenção (Ase Score < 8 no teste de atenção) */
  inattention: boolean;
  /** Feature 3: Nível alterado de consciência (RASS != 0) */
  alteredLevelOfConsciousness: boolean;
  /** Feature 4: Pensamento desorganizado */
  disorganizedThinking: boolean;
}

export interface CamIcuResult {
  hasDelirium: boolean;
  isAssessable: boolean;
  featuresPresent: {
    feature1: boolean;
    feature2: boolean;
    feature3: boolean;
    feature4: boolean;
  };
  classification: 'positive' | 'negative' | 'unassessable';
  clinicalSummary: string;
  calculatedAt: string;
}
