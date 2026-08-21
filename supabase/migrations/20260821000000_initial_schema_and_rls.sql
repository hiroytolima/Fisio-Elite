-- =============================================================================
-- Migration Inicial do Supabase para Fisio-Elite
-- Schema de Dados, Autenticação, Organizações e Políticas RLS (Row Level Security)
-- =============================================================================

-- 1. Tabela de Perfil do Usuário (relacionada ao auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  professional_id TEXT, -- CREFITO
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabela de Organizações / Clínicas (Multitenancy)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabela de Membros da Organização (RBAC)
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'administrator', 'supervisor', 'physiotherapist', 'intern', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

-- 4. Tabela de Pacientes
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  medical_record_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabela de Avaliações Clínicas (SOFA, ROX, Glasgow, HACOR, etc.)
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  evaluator_id UUID NOT NULL REFERENCES public.profiles(id),
  module_type TEXT NOT NULL, -- 'sofa', 'rox', 'glasgow', 'hacor', etc.
  score_data JSONB NOT NULL,
  result_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- HABILITAÇÃO OBRIGATÓRIA DE ROW LEVEL SECURITY (Deny by Default — Regra 2)
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- POLÍTICAS RLS (Row Level Security Policies)
-- =============================================================================

-- Profiles: Usuários autenticados podem ver e editar seus próprios perfis
CREATE POLICY "Profiles são acessíveis pelo próprio usuário" ON public.profiles
  FOR ALL TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Patients: Acesso restrito a membros da mesma organização
CREATE POLICY "Pacientes visíveis apenas para membros da mesma organização" ON public.patients
  FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Pacientes modificáveis por membros com permissão da organização" ON public.patients
  FOR INSERT TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

-- Assessments: Acesso restrito a membros da organização do paciente
CREATE POLICY "Avaliações visíveis apenas para membros da organização" ON public.assessments
  FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Avaliações inseríveis por fisioterapeutas autenticados" ON public.assessments
  FOR INSERT TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    ) AND evaluator_id = auth.uid()
  );
