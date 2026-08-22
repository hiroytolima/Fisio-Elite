# STATE.md — Fisio-Elite Memory

## Current Focus
Executando a **Fase 10 (Supabase Storage Privado)** utilizando a metodologia **Spec-Driven Development (SDD)**.

## Architecture Decisions
- **Decisão 1**: Abordagem *deny-by-default* no Supabase com isolamento rigoroso de RLS por `organization_id`.
- **Decisão 2**: Lógica clínica pura e desacoplada do React/Supabase em `src/modules/*/domain`.
- **Decisão 3**: FisioIA opera via Edge Function / AI Gateway server-side para resguardar secrets e aplicar filtro de privacidade.
- **Decisão 4**: Supabase Storage para arquivos clínicos utilizará buckets **estritamente privados** com presigned URLs temporárias.

## Blockers & Tech Debt
- Nenhum bloqueador ativo. Suíte de testes com 12/12 arquivos e 25/25 testes passados.
