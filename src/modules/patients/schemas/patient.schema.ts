import { z } from 'zod';

export const PatientSchema = z.object({
  id: z.string().uuid().optional(),
  organizationId: z.string().uuid(),
  fullName: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  medicalRecordNumber: z.string().min(1, 'Número de prontuário é obrigatório'),
  birthDate: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  bedNumber: z.string().optional(),
  admissionDate: z.string().default(() => new Date().toISOString()),
  diagnosis: z.string().optional(),
  status: z.enum(['active', 'discharged', 'transferred', 'deceased']).default('active'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Patient = z.infer<typeof PatientSchema>;

export const CreatePatientSchema = PatientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreatePatientInput = z.infer<typeof CreatePatientSchema>;
