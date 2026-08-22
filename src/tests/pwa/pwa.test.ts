import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Validação de PWA & Segurança de Cache (Fase 15)', () => {
  it('deve conter as configurações necessárias no manifest.webmanifest', () => {
    const manifestPath = path.resolve(__dirname, '../../../public/manifest.webmanifest');
    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    expect(manifestContent.name).toBeDefined();
    expect(manifestContent.short_name).toBeDefined();
    expect(manifestContent.display).toBe('standalone');
    expect(manifestContent.start_url).toBe('/');
    expect(manifestContent.theme_color).toBeDefined();
  });

  it('deve implementar regras de segurança no Service Worker bloqueando cache de dados de API/Supabase', () => {
    const swPath = path.resolve(__dirname, '../../../public/sw.js');
    const swContent = fs.readFileSync(swPath, 'utf-8');

    // Regra inegociável de segurança: o SW deve filtrar requisições do Supabase, auth e métodos não-GET
    expect(swContent).toContain('isSupabaseApi');
    expect(swContent).toContain('isEdgeFunction');
    expect(swContent).toContain('isNonGetMethod');
    expect(swContent).toContain('supabase.co');
  });
});
