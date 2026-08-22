import { describe, it, expect } from 'vitest';
import { calculateMrc } from '../domain/calculateMrc';

describe('MRC Pure Domain Function — Unit Tests', () => {
  it('deve calcular força máxima (60/60) como força normal', () => {
    const result = calculateMrc({
      scores: {
        shoulderAbductionRight: 5,
        shoulderAbductionLeft: 5,
        elbowFlexionRight: 5,
        elbowFlexionLeft: 5,
        wristExtensionRight: 5,
        wristExtensionLeft: 5,
        hipFlexionRight: 5,
        hipFlexionLeft: 5,
        kneeExtensionRight: 5,
        kneeExtensionLeft: 5,
        ankleDorsiflexionRight: 5,
        ankleDorsiflexionLeft: 5,
      },
    });

    expect(result.totalScore).toBe(60);
    expect(result.hasIcuAcquiredWeakness).toBe(false);
    expect(result.classification).toBe('normal_strength');
  });

  it('deve diagnosticar Fraqueza Adquirida na UTI (ICU-AW) quando MRC < 48', () => {
    const result = calculateMrc({
      scores: {
        shoulderAbductionRight: 3,
        shoulderAbductionLeft: 3,
        elbowFlexionRight: 4,
        elbowFlexionLeft: 4,
        wristExtensionRight: 3,
        wristExtensionLeft: 3,
        hipFlexionRight: 3,
        hipFlexionLeft: 3,
        kneeExtensionRight: 4,
        kneeExtensionLeft: 4,
        ankleDorsiflexionRight: 3,
        ankleDorsiflexionLeft: 3,
      },
    });

    expect(result.totalScore).toBe(40);
    expect(result.hasIcuAcquiredWeakness).toBe(true);
    expect(result.classification).toBe('icu_acquired_weakness');
  });

  it('deve diagnosticar Fraqueza Grave quando MRC < 36', () => {
    const result = calculateMrc({
      scores: {
        shoulderAbductionRight: 2,
        shoulderAbductionLeft: 2,
        elbowFlexionRight: 2,
        elbowFlexionLeft: 2,
        wristExtensionRight: 2,
        wristExtensionLeft: 2,
        hipFlexionRight: 2,
        hipFlexionLeft: 2,
        kneeExtensionRight: 2,
        kneeExtensionLeft: 2,
        ankleDorsiflexionRight: 2,
        ankleDorsiflexionLeft: 2,
      },
    });

    expect(result.totalScore).toBe(24);
    expect(result.hasIcuAcquiredWeakness).toBe(true);
    expect(result.classification).toBe('severe_weakness');
  });
});
