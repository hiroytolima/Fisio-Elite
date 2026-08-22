import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Cabeçalhos e Meta Tags de Segurança Web (Fase 13)', () => {
  it('deve conter as meta tags essenciais de segurança no index.html', () => {
    const indexPath = path.resolve(__dirname, '../../../index.html');
    const htmlContent = fs.readFileSync(indexPath, 'utf-8');

    expect(htmlContent).toContain('Content-Security-Policy');
    expect(htmlContent).toContain('X-Content-Type-Options');
    expect(htmlContent).toContain('referrer');
    expect(htmlContent).toContain('strict-origin-when-cross-origin');
  });

  it('deve conter as diretivas principais de CSP no index.html', () => {
    const indexPath = path.resolve(__dirname, '../../../index.html');
    const htmlContent = fs.readFileSync(indexPath, 'utf-8');

    expect(htmlContent).toContain("default-src 'self'");
    expect(htmlContent).toContain("frame-ancestors 'none'");
    expect(htmlContent).toContain('supabase.co');
  });

  it('deve ter cabeçalhos HTTP de segurança definidos no vite.config.ts', () => {
    const configPath = path.resolve(__dirname, '../../../vite.config.ts');
    const configContent = fs.readFileSync(configPath, 'utf-8');

    expect(configContent).toContain('Strict-Transport-Security');
    expect(configContent).toContain('X-Frame-Options');
    expect(configContent).toContain('Permissions-Policy');
  });
});
