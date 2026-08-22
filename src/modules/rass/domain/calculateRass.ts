import { RassInput, RassResult } from './rass.types';

export const RASS_LEVELS: Record<
  number,
  { term: string; description: string; classification: 'sedated' | 'alert_calm' | 'agitated'; recommendation: string }
> = {
  4: {
    term: 'Combativo',
    description: 'Agressivo, violento, perigo imediato para a equipe.',
    classification: 'agitated',
    recommendation: 'Reavaliar sedação/analgésicos, contenção de segurança e causas subjacentes (dor, hipóxia).',
  },
  3: {
    term: 'Muito Agitado',
    description: 'Puxa ou remove tubos/cateteres; agressivo.',
    classification: 'agitated',
    recommendation: 'Controle imediato da agitação e proteção de dispositivos invasivos.',
  },
  2: {
    term: 'Agitado',
    description: 'Movimentos desordenados frequentes, briga com o ventilador.',
    classification: 'agitated',
    recommendation: 'Avaliar assincronia ventilatória, dor ou ansiedade.',
  },
  1: {
    term: 'Inquieto',
    description: 'Ansioso ou apreensivo, mas sem movimentos agressivos.',
    classification: 'agitated',
    recommendation: 'Medidas não farmacológicas de reorientação e alívio da ansiedade.',
  },
  0: {
    term: 'Alerta e Calmo',
    description: 'Atento, calmo, responde adequadamente ao examinador.',
    classification: 'alert_calm',
    recommendation: 'Meta ideal para a maioria dos pacientes críticos. Manter monitoramento.',
  },
  [-1]: {
    term: 'Sonolento',
    description: 'Não totalmente alerta, mas sustenta olhar ao estômulo verbal (> 10 seg).',
    classification: 'sedated',
    recommendation: 'Nível aceitável de sedação consciente. Avaliar rotina de despertar diário.',
  },
  [-2]: {
    term: 'Sedação Leve',
    description: 'Acorda brevemente ao estímulo verbal e mantém contato visual (< 10 seg).',
    classification: 'sedated',
    recommendation: 'Sedação moderada. Avaliar protocolo de desmame de sedativos.',
  },
  [-3]: {
    term: 'Sedação Moderada',
    description: 'Movimenta-se ou abre os olhos ao estímulo verbal, sem contato visual.',
    classification: 'sedated',
    recommendation: 'Reduzir sedativos se a meta for sedação leve/desmame.',
  },
  [-4]: {
    term: 'Sedação Profunda',
    description: 'Sem resposta ao estímulo verbal, mas responde a estímulo físico leve.',
    classification: 'sedated',
    recommendation: 'Indicado apenas para casos específicos (ex: SDRA grave, hipertensão intracraniana).',
  },
  [-5]: {
    term: 'Incapaz de ser Despertado',
    description: 'Nenhuma resposta ao estímulo verbal ou físico.',
    classification: 'sedated',
    recommendation: 'Avaliar sobredose de sedativos/bloqueadores neuromusculares ou alteração neurológica estrutural.',
  },
};

/**
 * Função Pura de Domínio — Avaliação da Escala de RASS (Richmond Agitation-Sedation Scale)
 */
export function calculateRass(input: RassInput): RassResult {
  const level = RASS_LEVELS[input.score];
  if (!level) {
    throw new Error(`Escore RASS inválido: ${input.score}`);
  }

  return {
    score: input.score,
    term: level.term,
    description: level.description,
    classification: level.classification,
    clinicalRecommendation: level.recommendation,
    calculatedAt: new Date().toISOString(),
  };
}
