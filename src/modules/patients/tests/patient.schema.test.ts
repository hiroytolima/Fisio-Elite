import { describe, it, expect } from 'vitest';
import { CreatePatientSchema, PatientSchema } from '../schemas/patient.schema';

describe('Patients Domain Schemas — Validation Tests', () => {
  it('deve validar dados válidos de cadastro de paciente', () => {
    const validData = {
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      fullName: 'Carlos Eduardo Silva',
      medicalRecordNumber: 'PRON-2026-99',
      birthDate: '1985-04-12',
      gender: 'male' as const,
      bedNumber: 'UTI-04',
      diagnosis: 'Insuficiência Respiratória Aguda por Pneumonia Severa',
      status: 'active' as const,
    };

    const parsed = CreatePatientSchema.parse(validData);
    expect(parsed.fullName).toBe('Carlos Eduardo Silva');
    expect(parsed.medicalRecordNumber).toBe('PRON-2026-99');
  });

  it('deve rejeitar nome de paciente com menos de 3 caracteres', () => {
    const invalidData = {
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      fullName: 'Ab',
      medicalRecordNumber: 'PRON-01',
    };

    const result = CreatePatientSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('deve rejeitar prontuário sem número', () => {
    const invalidData = {
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      fullName: 'Maria Souza',
      medicalRecordNumber: '',
    };

    const result = CreatePatientSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
