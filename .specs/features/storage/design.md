# DESIGN — Fase 10: Supabase Storage Privado

## 1. Database & Storage Architecture

### Migration: `20260821000002_clinical_storage.sql`
- Criar o bucket `clinical-attachments` no esquema `storage.buckets`.
- Habilitar RLS no bucket `storage.objects`.
- Criar políticas RLS para `INSERT`, `SELECT` e `DELETE` baseadas em `organization_id` do usuário logado em `public.organization_members`.

### Schema da Tabela metadata: `patient_attachments`
```sql
CREATE TABLE public.patient_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(512) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
```

## 2. Componentes Frontend & Repository
- `StorageRepository.ts`: métodos `uploadAttachment()`, `getAttachmentSignedUrl()` e `deleteAttachment()`.
- Componente UI: `PatientAttachmentsList.tsx` integrado à página do paciente (`PatientsPage.tsx`).
