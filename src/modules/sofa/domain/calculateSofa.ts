import { SofaInput, SofaResult } from './sofa.types';

/**
 * Função Pura de Domínio — Cálculo do Escore SOFA (Sequential Organ Failure Assessment)
 * Não possui nenhuma dependência com React, DOM, Estado Global ou API.
 */
export function calculateSofa(input: SofaInput): SofaResult {
  let respiration = 0;
  if (input.pao2Fio2 < 100) respiration = 4;
  else if (input.pao2Fio2 < 200) respiration = 3;
  else if (input.pao2Fio2 < 300) respiration = 2;
  else if (input.pao2Fio2 < 400) respiration = 1;

  let coagulation = 0;
  if (input.platelets < 20) coagulation = 4;
  else if (input.platelets < 50) coagulation = 3;
  else if (input.platelets < 100) coagulation = 2;
  else if (input.platelets < 150) coagulation = 1;

  let liver = 0;
  if (input.bilirubin >= 12.0) liver = 4;
  else if (input.bilirubin >= 6.0) liver = 3;
  else if (input.bilirubin >= 2.0) liver = 2;
  else if (input.bilirubin >= 1.2) liver = 1;

  let cardiovascular = 0;
  if (input.map < 70) cardiovascular = 1;
  if (input.vasopressors === 'dopamine_high' || input.vasopressors === 'norepinephrine_high') {
    cardiovascular = 4;
  } else if (input.vasopressors === 'dopamine_med' || input.vasopressors === 'norepinephrine_low') {
    cardiovascular = 3;
  } else if (input.vasopressors === 'dopamine_low' || input.vasopressors === 'dobutamine') {
    cardiovascular = 2;
  }

  let cns = 0;
  if (input.glasgow < 6) cns = 4;
  else if (input.glasgow <= 9) cns = 3;
  else if (input.glasgow <= 12) cns = 2;
  else if (input.glasgow <= 14) cns = 1;

  let renal = 0;
  if (input.creatinine >= 5.0 || input.urineOutput < 200) renal = 4;
  else if (input.creatinine >= 3.5 || input.urineOutput < 500) renal = 3;
  else if (input.creatinine >= 2.0) renal = 2;
  else if (input.creatinine >= 1.2) renal = 1;

  const totalScore = respiration + coagulation + liver + cardiovascular + cns + renal;

  let mortalityRisk = 'Mortalidade estimada < 10%';
  if (totalScore >= 15) mortalityRisk = 'Mortalidade estimada > 80%';
  else if (totalScore >= 12) mortalityRisk = 'Mortalidade estimada ~50-80%';
  else if (totalScore >= 7) mortalityRisk = 'Mortalidade estimada ~15-20%';

  return {
    totalScore,
    breakdown: { respiration, coagulation, liver, cardiovascular, cns, renal },
    mortalityRisk,
    calculatedAt: new Date().toISOString(),
  };
}
