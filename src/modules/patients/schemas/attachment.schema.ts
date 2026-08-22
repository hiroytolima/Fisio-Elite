import { z } from 'zod';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
] as const;

export const attachmentSchema = z.object({
  fileName: z.string().min(1, 'Nome do arquivo é obrigatório').max(255),
  fileSize: z
    .number()
    .min(1, 'Arquivo vazio não é permitido')
    .max(MAX_FILE_SIZE_BYTES, 'Tamanho máximo permitido é 10MB'),
  mimeType: z.enum(ALLOWED_MIME_TYPES, {
    errorMap: () => ({ message: 'Tipo de arquivo não suportado. Envie PDF, PNG ou JPEG.' }),
  }),
  patientId: z.string().uuid('ID de paciente inválido'),
  organizationId: z.string().uuid('ID de organização inválido'),
});

export type AttachmentInput = z.infer<typeof attachmentSchema>;

export interface PatientAttachment {
  id: string;
  organizationId: string;
  patientId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  createdBy?: string;
  signedUrl?: string;
}
