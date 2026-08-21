import { describe, it, expect } from 'vitest';
import { calculateGlasgow } from '../domain/calculateGlasgow';
import glasgowFixtures from '../../../tests/clinical-fixtures/glasgow.json';

describe('Glasgow Coma Scale Pure Domain Function — Unit & Golden Tests', () => {
  it('deve calcular corretamente os casos clínicos de referência (Golden Tests)', () => {
    glasgowFixtures.forEach((fixture) => {
      // @ts-expect-error JSON fixture mapping
      const result = calculateGlasgow(fixture.input);
      expect(result.totalScore).toBe(fixture.expected.totalScore);
      if (fixture.expected.gcsPScore !== undefined) {
        expect(result.gcsPScore).toBe(fixture.expected.gcsPScore);
      }
      expect(result.severity).toBe(fixture.expected.severity);
    });
  });
});
