import { describe, it, expect } from 'vitest';
import { calculateCamIcu } from '../domain/calculateCamIcu';

describe('CAM-ICU Domain Algorithm — Unit Tests', () => {
  it('deve diagnosticar CAM-ICU Positivo quando F1+F2 e F3 (Consciência Alterada)', () => {
    const result = calculateCamIcu({
      acuteOnsetOrFluctuating: true,
      inattention: true,
      alteredLevelOfConsciousness: true,
      disorganizedThinking: false,
    });
    expect(result.hasDelirium).toBe(true);
    expect(result.classification).toBe('positive');
  });

  it('deve diagnosticar CAM-ICU Positivo quando F1+F2 e F4 (Pensamento Desorganizado)', () => {
    const result = calculateCamIcu({
      acuteOnsetOrFluctuating: true,
      inattention: true,
      alteredLevelOfConsciousness: false,
      disorganizedThinking: true,
    });
    expect(result.hasDelirium).toBe(true);
    expect(result.classification).toBe('positive');
  });

  it('deve diagnosticar CAM-ICU Negativo quando ausente inatenção (F2 false)', () => {
    const result = calculateCamIcu({
      acuteOnsetOrFluctuating: true,
      inattention: false,
      alteredLevelOfConsciousness: true,
      disorganizedThinking: true,
    });
    expect(result.hasDelirium).toBe(false);
    expect(result.classification).toBe('negative');
  });
});
