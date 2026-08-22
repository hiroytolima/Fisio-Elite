# SPECIFICATION — Fase 10: Storage Privado (Supabase Storage)

## Feature Overview
Implementar armazenamento privado e seguro de exames (raios-X, tomografias, relatórios clínicos em PDF/imagem) vinculados aos prontuários dos pacientes na plataforma **Fisio-Elite**, em total conformidade com a LGPD e a Regra 29/30 do Plano de Arquitetura.

## Requirements Matrix

| Requirement ID | Description | Acceptance Criteria |
| :--- | :--- | :--- |
| **REQ-STOR-01** | **Bucket Privado** | Criar bucket `clinical-attachments` com acesso `public: false` e políticas RLS restritas por `organization_id`. |
| **REQ-STOR-02** | **Validação de Upload** | Validar server-side e client-side: tamanho máx. 10MB, tipos MIME permitidos (`image/jpeg`, `image/png`, `application/pdf`). |
| **REQ-STOR-03** | **URLs Temporárias** | Gerar URLs presigned com expiração de 1 hora para visualização/download de anexos, sem expor URLs públicas permanentes. |
| **REQ-STOR-04** | **Audit Trail de Anexos** | Registrar na tabela `audit_logs` todo upload, download ou exclusão de anexo clínico com `actor_id` e timestamp. |
