import DOMPurify from 'dompurify';
import { z } from 'zod';

/**
 * Sanitiza strings arbitrárias para prevenir injeção XSS.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (typeof window === 'undefined') return dirtyHtml;
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'code', 'pre', 'br'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  });
}

/**
 * Validador de Saída Estruturada da FisioIA (Sec. 21 do Plano)
 */
export const FisioIAResponseSchema = z.object({
  summary: z.string().transform((val) => sanitizeHtml(val)),
  alerts: z.array(z.string().transform((val) => sanitizeHtml(val))),
  references: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export type FisioIAResponse = z.infer<typeof FisioIAResponseSchema>;

export function validateAndSanitizeFisioIAResponse(rawResponse: unknown): FisioIAResponse {
  return FisioIAResponseSchema.parse(rawResponse);
}
