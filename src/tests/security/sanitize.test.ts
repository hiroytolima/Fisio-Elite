import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeText } from '../../shared/lib/sanitize';

describe('Sanitização XSS (Fase 13 - Segurança Web)', () => {
  it('deve remover tags <script> e eventos maliciosos do HTML', () => {
    const maliciousInput = '<p>Texto seguro</p><script>alert("xss")</script><img src="x" onerror="alert(1)" />';
    const sanitized = sanitizeHtml(maliciousInput);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).toContain('<p>Texto seguro</p>');
  });

  it('deve remover URIs perigosas como javascript:', () => {
    const maliciousLink = '<a href="javascript:alert(1)">Clique aqui</a>';
    const sanitized = sanitizeHtml(maliciousLink);

    expect(sanitized).not.toContain('javascript:');
    expect(sanitized).toContain('Clique aqui');
  });

  it('deve remover todas as tags HTML ao sanitizar texto puro', () => {
    const dirtyText = '<h1>Título</h1><p>Parágrafo com <script>alert(1)</script> código</p>';
    const cleanText = sanitizeText(dirtyText);

    expect(cleanText).toBe('TítuloParágrafo com  código');
    expect(cleanText).not.toContain('<h1>');
    expect(cleanText).not.toContain('<script>');
  });
});
