# TASKS — Fase 10: Supabase Storage Privado

## Implementation Task Breakdown

- [x] **TASK-STOR-1**: Criar a migration SQL `20260821000002_clinical_storage.sql` com a tabela `patient_attachments`, bucket `clinical-attachments` e políticas RLS `deny-by-default`.
  - **Tests**: Teste de schema SQL e RLS.
  - **Gate**: `npx tsc --noEmit` (PASSADO)

- [x] **TASK-STOR-2**: Implementar o schema de validação Zod `attachment.schema.ts` para validação client/server de tamanho (10MB) e tipos MIME.
  - **Tests**: `attachment.schema.test.ts` (PASSADO 6/6 testes)
  - **Gate**: `npx vitest run src/modules/patients/tests/attachment.schema.test.ts` (PASSADO)

- [x] **TASK-STOR-3**: Criar o repositório `StorageRepository.ts` para upload, geração de signed URLs temporárias e registro de Audit Log imutável.
  - **Gate**: `npx tsc --noEmit` (PASSADO)

- [ ] **TASK-STOR-4**: Integrar a UI de anexos/exames em `PatientsPage.tsx` com upload drag-and-drop, indicador de progresso e visualizador seguro.
  - **Gate**: `npx tsc --noEmit && npx vitest run`
