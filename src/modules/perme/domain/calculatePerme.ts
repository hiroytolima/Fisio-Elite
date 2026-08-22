import { PermeInput, PermeResult } from './perme.types';

/**
 * Função Pura de Domínio — Perme ICU Mobility Score
 * Mede o nível de mobilidade de pacientes em UTI (0 a 32 pontos)
 */
export function calculatePerme(input: PermeInput): PermeResult {
  const totalScore =
    input.mentalStatus +
    input.mobilityBarriers +
    input.functionalStrength +
    input.bedMobility +
    input.transfers +
    input.gait +
    input.endurance;

  let mobilityLevel: PermeResult['mobilityLevel'] = 'high_mobility';
  let clinicalSummary = 'Excelente nível de mobilidade funcional na UTI. Paciente independente ou necessitando de suporte mínimo.';

  if (totalScore <= 11) {
    mobilityLevel = 'low_mobility';
    clinicalSummary = 'Baixa mobilidade funcional (0-11 pontos). Paciente restrito ao leito, alta dependência para transferências e alto risco de declínio funcional.';
  } else if (totalScore <= 22) {
    mobilityLevel = 'moderate_mobility';
    clinicalSummary = 'Mobilidade moderada (12-22 pontos). Paciente tolerando sedestação e/ou ortostatismo com assistência moderada a máxima.';
  }

  return {
    totalScore,
    maxPossibleScore: 32,
    mobilityLevel,
    clinicalSummary,
    calculatedAt: new Date().toISOString(),
  };
}
