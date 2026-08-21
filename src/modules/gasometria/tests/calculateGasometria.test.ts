import { describe, it, expect } from 'vitest';
import { calculateGasometria } from '../domain/calculateGasometria';
import gasometriaFixtures from '../../../tests/clinical-fixtures/gasometria.json';

describe('Gasometria Arterial Pure Domain Function — Unit & Golden Tests', () => {
  it('deve calcular corretamente os casos clínicos de referência (Golden Tests)', () => {
    gasometriaFixtures.forEach((fixture) => {
      const result = calculateGasometria(fixture.input);
      expect(result.disturbio).toBe(fixture.expected.disturbio);
      expect(result.oxigenacao).toBe(fixture.expected.oxigenacao);
      expect(result.relacaoPao2Fio2).toBe(fixture.expected.relacaoPao2Fio2);
    });
  });
});
