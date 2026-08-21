import { GlasgowInput, GlasgowResult } from './glasgow.types';

/**
 * Função Pura de Domínio — Cálculo da Escala de Coma de Glasgow (GCS e GCS-Pupilar)
 */
export function calculateGlasgow(input: GlasgowInput): GlasgowResult {
  const baseScore = input.eyeOpening + input.verbalResponse + input.motorResponse;
  const pupilDeduction = input.pupillaryReactivity ?? 0;
  const totalScore = Math.max(1, baseScore - pupilDeduction);

  let severity: GlasgowResult['severity'] = 'Trauma Cranioencefálico Leve';
  let recommendation = 'Observação neurológica contínua.';

  if (totalScore <= 8) {
    severity = 'Trauma Cranioencefálico Grave';
    recommendation = 'Indicação de proteção de via aérea (intubação orotraqueal) e monitoramento de PIC.';
  } else if (totalScore <= 12) {
    severity = 'Trauma Cranioencefálico Moderado';
    recommendation = 'Avaliação por Tomografia Computadorizada de Crânio e internação em UTI/Semi-intensiva.';
  }

  return {
    totalScore: baseScore,
    gcsPScore: input.pupillaryReactivity !== undefined ? totalScore : undefined,
    severity,
    recommendation,
    calculatedAt: new Date().toISOString(),
  };
}
