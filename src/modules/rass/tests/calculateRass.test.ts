import { describe, it, expect } from 'vitest';
import { calculateRass } from '../domain/calculateRass';
import { RassScore } from '../domain/rass.types';

describe('RASS Domain Logic Tests', () => {
  it('deve identificar corretamente paciente Alerta e Calmo (score 0)', () => {
    const result = calculateRass({ score: 0 });
    expect(result.classification).toBe('alert_calm');
    expect(result.term).toBe('Alerta e Calmo');
  });

  it('deve identificar paciente agitado (score +3)', () => {
    const result = calculateRass({ score: 3 });
    expect(result.classification).toBe('agitated');
    expect(result.term).toBe('Muito Agitado');
  });

  it('deve identificar paciente sob sedação moderada (score -3)', () => {
    const result = calculateRass({ score: -3 });
    expect(result.classification).toBe('sedated');
    expect(result.term).toBe('Sedação Moderada');
  });

  it('deve rejeitar score fora dos limites estipulados', () => {
    expect(() => calculateRass({ score: 6 as RassScore })).toThrow();
  });
});
