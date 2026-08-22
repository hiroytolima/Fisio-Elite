import { describe, it, expect } from 'vitest';
import { redactSensitiveData } from '../../shared/observability/redact';

describe('Observabilidade & Privacy Redaction (Fase 16)', () => {
  it('deve mascarar propriedades contendo dados sensíveis ou PII', () => {
    const rawData = {
      user_id: 'usr_123',
      patient_name: 'Maria Silva',
      cpf: '123.456.789-00',
      password: 'SuperSecretPassword123!',
      token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      clinical_note: 'Paciente em ventilação mecânica.',
    };

    const redacted = redactSensitiveData(rawData);

    expect(redacted.user_id).toBe('usr_123');
    expect(redacted.patient_name).toBe('[REDACTED]');
    expect(redacted.cpf).toBe('[REDACTED]');
    expect(redacted.password).toBe('[REDACTED]');
    expect(redacted.token).toBe('[REDACTED]');
    expect(redacted.clinical_note).toBe('Paciente em ventilação mecânica.');
  });

  it('deve mascarar recursivamente objetos aninhados com PII', () => {
    const nestedData = {
      event: 'PATIENT_ASSESSMENT_CREATED',
      meta: {
        professional: {
          id: 'prof_99',
          email: 'medico@hospital.com',
        },
        patient: {
          name: 'João Souza',
          diagnosis: 'ARDS',
        },
      },
    };

    const redacted = redactSensitiveData(nestedData);

    expect(redacted.meta.professional.id).toBe('prof_99');
    expect(redacted.meta.professional.email).toBe('[REDACTED]');
    expect(redacted.meta.patient.name).toBe('[REDACTED]');
    expect(redacted.meta.patient.diagnosis).toBe('[REDACTED]');
  });
});
