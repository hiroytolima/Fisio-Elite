-- =============================================================================
-- Migration Fase 8: Expansão do Módulo de Pacientes, Dados Clínicos e Trilha de Auditoria
-- =============================================================================

-- 1. Expansão da tabela de Pacientes
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  ADD COLUMN IF NOT EXISTS bed_number TEXT,
  ADD COLUMN IF NOT EXISTS admission_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS diagnosis TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'discharged', 'transferred', 'deceased'));

-- 2. Tabela de Trilha de Auditoria (Audit Trail - Regra 34)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  actor_id UUID NOT NULL REFERENCES public.profiles(id),
  action TEXT NOT NULL, -- 'patient.create', 'patient.update', 'assessment.create', 'patient.read', etc.
  resource_type TEXT NOT NULL, -- 'patient', 'assessment', 'profile'
  resource_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS no Audit Log
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit Logs: Apenas leitura para administradores/supervisores da mesma organização
CREATE POLICY "Audit logs visíveis apenas para admins/supervisores da organização" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'administrator', 'supervisor')
    )
  );

-- Audit Logs: Inserível por qualquer usuário autenticado realizando ações na sua organização
CREATE POLICY "Audit logs inseríveis por ações autenticadas" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    actor_id = auth.uid()
  );

-- 3. Índices no PostgreSQL para Otimização de Performance e Queries RLS (Regra 49)
CREATE INDEX IF NOT EXISTS idx_patients_organization_id ON public.patients(organization_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON public.patients(status);
CREATE INDEX IF NOT EXISTS idx_assessments_patient_id ON public.assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_organization_id ON public.assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
