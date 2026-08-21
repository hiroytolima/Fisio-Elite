export interface RoxInput {
  spo2: number; // Porcentagem (ex: 95 para 95%)
  fio2: number; // Porcentagem (ex: 50 para 50%) ou fração (0.50)
  rr: number;   // Frequência Respiratória (irpm)
}

export interface RoxResult {
  roxIndex: number;
  riskCategory: 'Alto Risco de Falha da CNOF' | 'Zona Cinzenta / Reavaliar' | 'Baixo Risco de Falha';
  recommendation: string;
  calculatedAt: string;
}
