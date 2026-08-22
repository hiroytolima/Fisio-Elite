import { describe, it, expect } from 'vitest';
import { attachmentSchema, MAX_FILE_SIZE_BYTES } from '../schemas/attachment.schema';

describe('Attachment Schema Validation (Storage - REQ-STOR-02)', () => {
  const validPayload = {
    fileName: 'exame_raio_x_torax.pdf',
    fileSize: 2 * 1024 * 1024, // 2MB
    mimeType: 'application/pdf',
    patientId: '123e4567-e89b-12d3-a456-426614174000',
    organizationId: '987e6543-e89b-12d3-a456-426614174000',
  };

  it('should validate a valid PDF attachment payload', () => {
    const result = attachmentSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should validate JPEG and PNG image files', () => {
    expect(attachmentSchema.safeParse({ ...validPayload, mimeType: 'image/jpeg' }).success).toBe(true);
    expect(attachmentSchema.safeParse({ ...validPayload, mimeType: 'image/png' }).success).toBe(true);
  });

  it('should reject unsupported file MIME types (e.g. exe, zip, txt)', () => {
    const result = attachmentSchema.safeParse({ ...validPayload, mimeType: 'application/zip' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('Tipo de arquivo não suportado');
    }
  });

  it('should reject files exceeding 10MB', () => {
    const result = attachmentSchema.safeParse({
      ...validPayload,
      fileSize: MAX_FILE_SIZE_BYTES + 1,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('Tamanho máximo permitido é 10MB');
    }
  });

  it('should reject empty files (0 bytes)', () => {
    const result = attachmentSchema.safeParse({ ...validPayload, fileSize: 0 });
    expect(result.success).toBe(false);
  });

  it('should reject invalid UUIDs for patient or organization', () => {
    const result = attachmentSchema.safeParse({ ...validPayload, patientId: 'invalid-id' });
    expect(result.success).toBe(false);
  });
});
