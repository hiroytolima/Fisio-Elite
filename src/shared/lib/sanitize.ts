import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content using DOMPurify to prevent XSS attacks.
 * @param dirty HTML string to sanitize
 * @returns Clean, safe HTML string
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitizes plain text input by stripping out all HTML tags.
 * @param dirty Text input that may contain HTML tags
 * @returns Pure text string without HTML tags
 */
export function sanitizeText(dirty: string): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] }).trim();
}
