export interface HacorInput {
  hr: number;      // Frequência Cardíaca (bpm)
  ph: number;      // pH arterial
  gcs: number;     // Glasgow Coma Scale (3-15)
  pao2Fio2: number; // PaO2 / FiO2
  rr: number;      // Frequência Respiratória (irpm)
}

export interface HacorResult {
  totalScore: number;
  breakdown: {
    hrPoints: number;
    phPoints: number;
    gcsPoints: number;
    pao2Fio2Points: number;
    rrPoints: number;
  };
  failureRisk: 'Baixo Risco de Falha da VNI (< 20%)' | 'Alto Risco de Falha da VNI (> 80%)';
  recommendation: string;
  calculatedAt: string;
}
