import { describe, it, expect } from 'vitest';
import { calculateSofa } from '../domain/calculateSofa';
import sofaFixtures from '../../../tests/clinical-fixtures/sofa.json';

describe('SOFA Pure Domain Function — Unit & Golden Tests', () => {
  it('deve calcular corretamente os casos clínicos de referência (Golden Tests)', () => {
    sofaFixtures.forEach((fixture) => {
      // @ts-expect-error type assertion from json fixture
      const result = calculateSofa(fixture.input);
      expect(result.totalScore).toBe(fixture.expected.totalScore);
      expect(result.mortalityRisk).toBe(fixture.expected.mortalityRisk);
    });
  });

  it('deve retornar pontuação 0 para parâmetros normais', () => {
    const result = calculateSofa({
      pao2Fio2: 500,
      platelets: 200,
      bilirubin: 0.5,
      map: 90,
      vasopressors: 'none',
      glasgow: 15,
      creatinine: 0.8,
      urineOutput: 2000,
    });
    expect(result.totalScore).toBe(0);
  });
});
