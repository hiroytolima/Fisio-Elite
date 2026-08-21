import { describe, it, expect } from 'vitest';
import { calculateRox } from '../domain/calculateRox';
import roxFixtures from '../../../tests/clinical-fixtures/rox.json';

describe('ROX Index Pure Domain Function — Unit & Golden Tests', () => {
  it('deve calcular corretamente os casos clínicos de referência (Golden Tests)', () => {
    roxFixtures.forEach((fixture) => {
      const result = calculateRox(fixture.input);
      expect(result.roxIndex).toBe(fixture.expected.roxIndex);
      expect(result.riskCategory).toBe(fixture.expected.riskCategory);
    });
  });

  it('deve lançar erro caso FiO2 ou RR sejam inválidos ou zero', () => {
    expect(() => calculateRox({ spo2: 95, fio2: 0, rr: 20 })).toThrow();
  });
});
