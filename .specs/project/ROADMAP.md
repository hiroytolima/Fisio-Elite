# ROADMAP.md — Fisio-Elite

## Completed Phases
- [x] **Fase 0 — Requisitos & Threat Modeling**: Mapeamento de dados sensíveis e riscos.
- [x] **Fase 1 — Base React**: Vite, React 19, TypeScript strict, React Router.
- [x] **Fase 2 & 3 — Supabase Foundation & Database Security**: PostgreSQL, Auth, RLS deny-by-default por organização.
- [x] **Fase 4 & 5 — Design System & State**: Tailwind CSS, Radix UI, TanStack Query, Zustand, RHF + Zod.
- [x] **Fase 6 — Domain Layer Clínico**: Módulos puros (Gasometria, ROX, Glasgow, SOFA, HACOR, PERME, MRC, RASS, CAM-ICU).
- [x] **Fase 7 — Qualidade Clínica**: 100% de cobertura determinística Vitest (25/25 testes passados).
- [x] **Fase 8 — Pacientes e Prontuários**: Migration SQL, Repositório e UI de Leitos de UTI.
- [x] **Fase 9 — Autenticação e RBAC**: Permissões e roles integrados.
- [x] **Fases 11-15 — Edge Functions, FisioIA, Web Security, A11y, PWA**: Concluídas.

## Current Phase in Progress
- [ ] **Fase 10 — Storage Privado (Supabase Storage)**: Buckets privados para upload de exames/documentos clínicos com RLS, validação MIME e limites de tamanho (Regras 29 e 30).

## Upcoming Phases
- [ ] **Fase 16 — Observabilidade**: Error tracking sanitizado e alertas.
- [ ] **Fase 17 — CI/CD Pipeline**: GitHub Actions automatizado com gates de teste.
- [ ] **Fase 18 — Hardening**: OWASP ASVS e DAST.
- [ ] **Fase 19 — Produção**: Load testing e Disaster Recovery.
