import { MrcInput, MrcResult } from './mrc.types';

/**
 * Função Pura de Domínio — Cálculo do Escore MRC (Medical Research Council - Força Muscular na UTI)
 */
export function calculateMrc(input: MrcInput): MrcResult {
  const {
    shoulderAbductionRight,
    shoulderAbductionLeft,
    elbowFlexionRight,
    elbowFlexionLeft,
    wristExtensionRight,
    wristExtensionLeft,
    hipFlexionRight,
    hipFlexionLeft,
    kneeExtensionRight,
    kneeExtensionLeft,
    ankleDorsiflexionRight,
    ankleDorsiflexionLeft,
  } = input.scores;

  const upperLimbsScore =
    shoulderAbductionRight +
    shoulderAbductionLeft +
    elbowFlexionRight +
    elbowFlexionLeft +
    wristExtensionRight +
    wristExtensionLeft;

  const lowerLimbsScore =
    hipFlexionRight +
    hipFlexionLeft +
    kneeExtensionRight +
    kneeExtensionLeft +
    ankleDorsiflexionRight +
    ankleDorsiflexionLeft;

  const totalScore = upperLimbsScore + lowerLimbsScore;
  const hasIcuAcquiredWeakness = totalScore < 48;

  let classification: MrcResult['classification'] = 'normal_strength';
  let clinicalSummary = 'Força muscular preservada ou sem critérios para fraqueza adquirida na UTI.';

  if (totalScore < 36) {
    classification = 'severe_weakness';
    clinicalSummary = 'Fraqueza muscular grave adquirida na UTI (MRC < 36). Alto risco de desmame ventilatório difícil e dependência funcional prolongada.';
  } else if (hasIcuAcquiredWeakness) {
    classification = 'icu_acquired_weakness';
    clinicalSummary = 'Fraqueza Muscular Adquirida na UTI (ICU-AW) confirmada (MRC < 48). Indicada mobilização precoce intensiva.';
  }

  return {
    totalScore,
    maxPossibleScore: 60,
    upperLimbsScore,
    lowerLimbsScore,
    hasIcuAcquiredWeakness,
    classification,
    clinicalSummary,
    calculatedAt: new Date().toISOString(),
  };
}
