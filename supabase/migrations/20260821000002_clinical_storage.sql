-- Migration: Clinical Storage & Patient Attachments
-- Phase 10: Storage Privado (Supabase Storage)

-- 1. Tabela de metadados de anexos do paciente
CREATE TABLE IF NOT EXISTS public.patient_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(512) NOT NULL UNIQUE,
  file_size INT NOT NULL CHECK (file_size > 0 AND file_size <= 10485760), -- Max 10MB (10 * 1024 * 1024)
  mime_type VARCHAR(100) NOT NULL CHECK (mime_type IN ('application/pdf', 'image/jpeg', 'image/png')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Habilitar RLS na tabela patient_attachments
ALTER TABLE public.patient_attachments ENABLE ROW LEVEL SECURITY;

-- 2. Políticas RLS para patient_attachments
CREATE POLICY "Users can view attachments from their organization"
  ON public.patient_attachments
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert attachments for their organization"
  ON public.patient_attachments
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete attachments from their organization"
  ON public.patient_attachments
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );

-- 3. Criar bucket de storage privado
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'clinical-attachments',
  'clinical-attachments',
  false, -- Bucket estritamente privado
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png'];

-- 4. Políticas RLS no storage.objects para o bucket clinical-attachments
CREATE POLICY "Storage Select: Users access attachments of their organization"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'clinical-attachments' AND
    (storage.foldername(name))[1]::uuid IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Storage Insert: Users upload attachments to their organization"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'clinical-attachments' AND
    (storage.foldername(name))[1]::uuid IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Storage Delete: Users delete attachments of their organization"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'clinical-attachments' AND
    (storage.foldername(name))[1]::uuid IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );
