import { RoxInput, RoxResult } from './rox.types';

/**
 * Função Pura de Domínio — Cálculo do Índice ROX (SpO2 / FiO2 / FR)
 * ROX = (SpO2 / (FiO2 / 100)) / FR
 */
export function calculateRox(input: RoxInput): RoxResult {
  // Normalizar FiO2 se for passada como fração (ex: 0.5 em vez de 50)
  const fio2Percent = input.fio2 <= 1 ? input.fio2 * 100 : input.fio2;

  if (fio2Percent <= 0 || input.rr <= 0) {
    throw new Error('FiO2 e Frequência Respiratória devem ser maiores que zero.');
  }

  const fio2Fraction = fio2Percent / 100;
  const roxIndex = Number(((input.spo2 / fio2Fraction) / input.rr).toFixed(2));

  let riskCategory: RoxResult['riskCategory'] = 'Baixo Risco de Falha';
  let recommendation = 'Manter CNOF e monitorar periodicamente.';

  if (roxIndex < 3.85) {
    riskCategory = 'Alto Risco de Falha da CNOF';
    recommendation = 'Considerar intubação orotraqueal e ventilação mecânica invasiva imediata.';
  } else if (roxIndex < 4.88) {
    riskCategory = 'Zona Cinzenta / Reavaliar';
    recommendation = 'Reavaliar Índice ROX em 2 a 4 horas. Preparar material de intubação se não houver melhora.';
  }

  return {
    roxIndex,
    riskCategory,
    recommendation,
    calculatedAt: new Date().toISOString(),
  };
}
