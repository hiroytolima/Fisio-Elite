import { CamIcuInput, CamIcuResult } from './camIcu.types';

/**
 * Função Pura de Domínio — Algoritmo CAM-ICU (Confusion Assessment Method for the ICU)
 * Critério Positivo: (Feature 1 + Feature 2) AND (Feature 3 OR Feature 4)
 */
export function calculateCamIcu(input: CamIcuInput): CamIcuResult {
  const { acuteOnsetOrFluctuating, inattention, alteredLevelOfConsciousness, disorganizedThinking } = input;

  const hasDelirium = (acuteOnsetOrFluctuating && inattention) && (alteredLevelOfConsciousness || disorganizedThinking);

  let classification: CamIcuResult['classification'] = 'negative';
  let clinicalSummary = 'CAM-ICU Negativo (Sem delirium detectado nesta avaliação). Manter protocolo de prevenção de delirium (ABCDEF bundle).';

  if (hasDelirium) {
    classification = 'positive';
    clinicalSummary = 'CAM-ICU Positivo (Delirium Detectado). Investigar causas reversíveis (dor, hipóxia, infecção, perturbações eletrolíticas, fármacos deliriogênicos).';
  }

  return {
    hasDelirium,
    isAssessable: true,
    featuresPresent: {
      feature1: acuteOnsetOrFluctuating,
      feature2: inattention,
      feature3: alteredLevelOfConsciousness,
      feature4: disorganizedThinking,
    },
    classification,
    clinicalSummary,
    calculatedAt: new Date().toISOString(),
  };
}
