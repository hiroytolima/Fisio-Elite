import { HacorInput, HacorResult } from './hacor.types';

/**
 * Função Pura de Domínio — Cálculo do Escore HACOR (Heart rate, Acidosis, Consciousness, Oxygenation, Respiratory rate)
 */
export function calculateHacor(input: HacorInput): HacorResult {
  let hrPoints = 0;
  if (input.hr >= 121) hrPoints = 1;

  let phPoints = 0;
  if (input.ph < 7.25) phPoints = 4;
  else if (input.ph <= 7.29) phPoints = 3;
  else if (input.ph <= 7.34) phPoints = 2;

  let gcsPoints = 0;
  if (input.gcs <= 12) gcsPoints = 3;
  else if (input.gcs <= 14) gcsPoints = 1;

  let pao2Fio2Points = 0;
  if (input.pao2Fio2 < 100) pao2Fio2Points = 6;
  else if (input.pao2Fio2 <= 174) pao2Fio2Points = 4;
  else if (input.pao2Fio2 <= 224) pao2Fio2Points = 3;

  let rrPoints = 0;
  if (input.rr >= 45) rrPoints = 2;
  else if (input.rr >= 31) rrPoints = 1;

  const totalScore = hrPoints + phPoints + gcsPoints + pao2Fio2Points + rrPoints;

  const isHighRisk = totalScore > 5;
  const failureRisk = isHighRisk
    ? 'Alto Risco de Falha da VNI (> 80%)'
    : 'Baixo Risco de Falha da VNI (< 20%)';

  const recommendation = isHighRisk
    ? 'Escore HACOR > 5: Alto risco de falha da VNI. Recomenda-se considerar intubação orotraqueal sem postergação.'
    : 'Escore HACOR ≤ 5: Manter VNI com reavaliação periódica em 1 a 2 horas.';

  return {
    totalScore,
    breakdown: { hrPoints, phPoints, gcsPoints, pao2Fio2Points, rrPoints },
    failureRisk,
    recommendation,
    calculatedAt: new Date().toISOString(),
  };
}
