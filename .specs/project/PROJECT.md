# PROJECT.md — Fisio-Elite

## Visão Geral do Projeto
O **Fisio-Elite** é uma plataforma PWA/SPA de nível de produção para decisão clínica, suporte ao fisioterapeuta, educação continuada e gestão hospitalar/ambulatorial, estruturada em arquitetura híbrida (React 19 + TypeScript Strict + Supabase + PostgreSQL + RLS + Edge Functions).

## Escopo Completo do Plano Oficial (Fases 0 a 19)

### 🟢 Fases Concluídas (Documentadas em `.specs/features/`):
- **Fase 0 — Requisitos, Dados e Threat Modeling** (`.specs/features/phase0-threat-model/`)
- **Fase 1 — Base React** (`.specs/features/phase1-base-react/`)
- **Fase 2 — Supabase Foundation** (`.specs/features/phase2-supabase-foundation/`)
- **Fase 3 — Database Security & RLS** (`.specs/features/phase3-database-security/`)
- **Fase 4 — Design System & Acessibilidade Visual** (`.specs/features/phase4-design-system/`)
- **Fase 5 — Formulários, Repositórios e Estado** (`.specs/features/phase5-forms-state/`)
- **Fase 6 — Domain Layer Clínico (9 Módulos Clínicos)** (`.specs/features/phase6-clinical-domain/`)
- **Fase 7 — Qualidade Clínica & Golden Tests** (`.specs/features/phase7-clinical-quality/`)
- **Fase 8 — Pacientes, Leitos de UTI e Audit Trail** (`.specs/features/phase8-patients-records/`)
- **Fase 9 — Autenticação e Autorização RBAC** (`.specs/features/phase9-auth-rbac/`)
- **Fase 11 — Edge Functions Server-Side** (`.specs/features/phase11-edge-functions/`)
- **Fase 12 — FisioIA Gateway & Guardrails** (`.specs/features/phase12-fisioia/`)
- **Fase 13 — Segurança Web & Headers (OWASP)** (`.specs/features/phase13-web-security/`)
- **Fase 14 — Acessibilidade WCAG 2.2 AA** (`.specs/features/phase14-accessibility/`)
- **Fase 15 — PWA e Cache Seguro Offline** (`.specs/features/phase15-pwa/`)

### 🟡 Fase em Andamento (SDD Ativo):
- **Fase 10 — Storage Privado no Supabase** (`.specs/features/storage/`)

### 🔴 Próximas Fases Planejadas:
- **Fase 16 — Observabilidade Sanitizada** (`.specs/features/phase16-observability/`)
- **Fase 17 — CI/CD Pipeline Automatizado** (`.specs/features/phase17-cicd/`)
- **Fase 18 — Hardening OWASP ASVS & DAST** (`.specs/features/phase18-hardening/`)
- **Fase 19 — Produção & Disaster Recovery** (`.specs/features/phase19-production/`)

## Regras Inegociáveis da Plataforma
1. **Frontend ≠ Fronteira de Segurança**: Nenhuma decisão de acesso é tomada no navegador.
2. **Deny-by-Default em Tabelas Privadas**: RLS habilitada e testada no PostgreSQL.
3. **Módulos Clínicos Determinísticos**: Lógica pura e isolada de React/Supabase.
4. **FisioIA Server-Side**: Comunicação com LLM estritamente via Gateway/Edge Functions.
