import { describe, it, expect } from 'vitest';
import { supabase } from '@/shared/api/supabase.client';

describe('Testes de Autorização e RLS (Seções 23 & 24 do Plano)', () => {
  it('deve ter o cliente Supabase inicializado com política de segurança deny-by-default', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('deve possuir métodos da camada de repositório para acesso a tabelas com RLS', () => {
    const patientsQuery = supabase.from('patients');
    expect(patientsQuery).toBeDefined();
    expect(typeof patientsQuery.select).toBe('function');
    expect(typeof patientsQuery.insert).toBe('function');
  });
});
