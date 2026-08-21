export interface GasometriaInput {
  ph: number;       // pH (normal: 7.35 - 7.45)
  paco2: number;    // PaCO2 em mmHg (normal: 35 - 45)
  hco3: number;     // HCO3 em mEq/L (normal: 22 - 26)
  pao2: number;     // PaO2 em mmHg (normal: 80 - 100)
  fio2: number;     // FiO2 em % (normal: 21)
  be?: number;      // Base Excess em mEq/L (normal: -2 a +2)
}

export type DisturbioAcidobasico =
  | 'Gasometria Arterial Normal'
  | 'Acidose Respiratória Não Compensada'
  | 'Acidose Respiratória Parcialmente Compensada'
  | 'Acidose Respiratória Compensada'
  | 'Alcalose Respiratória Não Compensada'
  | 'Alcalose Respiratória Parcialmente Compensada'
  | 'Alcalose Respiratória Compensada'
  | 'Acidose Metabólica Não Compensada'
  | 'Acidose Metabólica Parcialmente Compensada'
  | 'Acidose Metabólica Compensada'
  | 'Alcalose Metabólica Não Compensada'
  | 'Alcalose Metabólica Parcialmente Compensada'
  | 'Alcalose Metabólica Compensada'
  | 'Distúrbio Misto / Complexo';

export interface GasometriaResult {
  disturbio: DisturbioAcidobasico;
  oxigenacao: 'Normoxemia' | 'Hipoxemia Leve' | 'Hipoxemia Moderada' | 'Hipoxemia Grave';
  relacaoPao2Fio2: number;
  anionGapEstimado?: number;
  recommendation: string;
  calculatedAt: string;
}
