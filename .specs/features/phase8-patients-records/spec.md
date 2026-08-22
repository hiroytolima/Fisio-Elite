# SPECIFICATION — Fase 8: Pacientes, Prontuários e Audit Trail

## Overview
Estruturação de dados de pacientes, gestão visual de leitos de UTI, vinculação direta de avaliações clínicas aos prontuários e geração automática de logs de auditoria imutáveis.

## Schema SQL & Migration
- File: `supabase/migrations/20260821000001_patients_and_audit_trail.sql`
- Tabelas: `patients`, `assessments`, `audit_logs`.
- Segregação por `organization_id` via políticas RLS `deny-by-default`.
