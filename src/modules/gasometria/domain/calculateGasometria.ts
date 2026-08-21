import { GasometriaInput, GasometriaResult, DisturbioAcidobasico } from './gasometria.types';

/**
 * Função Pura de Domínio — Análise de Gasometria Arterial
 */
export function calculateGasometria(input: GasometriaInput): GasometriaResult {
  const { ph, paco2, hco3, pao2, fio2 } = input;

  // Cálculo da Relação PaO2 / FiO2
  const fio2Fraction = fio2 <= 1 ? fio2 : fio2 / 100;
  const relacaoPao2Fio2 = Math.round(pao2 / fio2Fraction);

  // Oxigenação
  let oxigenacao: GasometriaResult['oxigenacao'] = 'Normoxemia';
  if (pao2 < 60) oxigenacao = 'Hipoxemia Grave';
  else if (pao2 < 70) oxigenacao = 'Hipoxemia Moderada';
  else if (pao2 < 80) oxigenacao = 'Hipoxemia Leve';

  // Análise Acido-Básica
  let disturbio: DisturbioAcidobasico = 'Gasometria Arterial Normal';
  let recommendation = 'Manter ventilação e estabilidade metabólica.';

  const isAcidemia = ph < 7.35;
  const isAlcalemia = ph > 7.45;
  const isRespAcid = paco2 > 45;
  const isRespAlk = paco2 < 35;
  const isMetAcid = hco3 < 22;
  const isMetAlk = hco3 > 26;

  if (isAcidemia) {
    if (isRespAcid && isMetAcid) {
      disturbio = 'Distúrbio Misto / Complexo';
      recommendation = 'Acidose Mista (Respiratória e Metabólica). Requer otimização ventilatória e correção metabólica urgente.';
    } else if (isRespAcid) {
      if (isMetAlk) {
        disturbio = 'Acidose Respiratória Parcialmente Compensada';
        recommendation = 'Acidose respiratória com retenção compensatória de HCO3. Avaliar suporte ventilatório.';
      } else {
        disturbio = 'Acidose Respiratória Não Compensada';
        recommendation = 'Acidose respiratória aguda. Indicação de aumentar ventilação alveolar (volume minuto).';
      }
    } else if (isMetAcid) {
      if (isRespAlk) {
        disturbio = 'Acidose Metabólica Parcialmente Compensada';
        recommendation = 'Acidose metabólica com hiperventilação compensatória. Investigar etiologia (lactato, cetoacidose, renal).';
      } else {
        disturbio = 'Acidose Metabólica Não Compensada';
        recommendation = 'Acidose metabólica primária não compensada.';
      }
    }
  } else if (isAlcalemia) {
    if (isRespAlk && isMetAlk) {
      disturbio = 'Distúrbio Misto / Complexo';
      recommendation = 'Alcalose Mista. Reduzir ventilação/ajustes iatrogênicos.';
    } else if (isRespAlk) {
      if (isMetAcid) {
        disturbio = 'Alcalose Respiratória Parcialmente Compensada';
      } else {
        disturbio = 'Alcalose Respiratória Não Compensada';
      }
      recommendation = 'Alcalose respiratória. Reduzir frequência ventilatória ou tratar dor/ansiedade.';
    } else if (isMetAlk) {
      if (isRespAcid) {
        disturbio = 'Alcalose Metabólica Parcialmente Compensada';
      } else {
        disturbio = 'Alcalose Metabólica Não Compensada';
      }
      recommendation = 'Alcalose metabólica. Avaliar reposição eletrolítica (K+, Cl-).';
    }
  } else {
    // pH Normal
    if (isRespAcid && isMetAlk) {
      disturbio = 'Acidose Respiratória Compensada';
      recommendation = 'Distúrbio crônico compensado.';
    } else if (isRespAlk && isMetAcid) {
      disturbio = 'Alcalose Respiratória Compensada';
      recommendation = 'Distúrbio crônico compensado.';
    }
  }

  return {
    disturbio,
    oxigenacao,
    relacaoPao2Fio2,
    recommendation,
    calculatedAt: new Date().toISOString(),
  };
}
