import { describe, it, expect } from 'vitest';
import { calculatePerme } from '../domain/calculatePerme';

describe('PERME Pure Domain Function — Unit Tests', () => {
  it('deve calcular mobilidade baixa para pontuações <= 11', () => {
    const result = calculatePerme({
      mentalStatus: 1,
      mobilityBarriers: 0,
      functionalStrength: 1,
      bedMobility: 1,
      transfers: 1,
      gait: 0,
      endurance: 0,
    });
    expect(result.totalScore).toBe(4);
    expect(result.mobilityLevel).toBe('low_mobility');
  });

  it('deve calcular mobilidade excelente (32/32)', () => {
    const result = calculatePerme({
      mentalStatus: 3,
      mobilityBarriers: 2,
      functionalStrength: 4,
      bedMobility: 6,
      transfers: 8,
      gait: 6,
      endurance: 3,
    });
    expect(result.totalScore).toBe(32);
    expect(result.mobilityLevel).toBe('high_mobility');
  });
});
