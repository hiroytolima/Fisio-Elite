import { describe, it, expect } from 'vitest';
import { calculateHacor } from '../domain/calculateHacor';
import hacorFixtures from '../../../tests/clinical-fixtures/hacor.json';

describe('HACOR Score Pure Domain Function — Unit & Golden Tests', () => {
  it('deve calcular corretamente os casos clínicos de referência (Golden Tests)', () => {
    hacorFixtures.forEach((fixture) => {
      const result = calculateHacor(fixture.input);
      expect(result.totalScore).toBe(fixture.expected.totalScore);
      expect(result.failureRisk).toBe(fixture.expected.failureRisk);
    });
  });
});
