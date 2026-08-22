import { supabase } from '@/shared/api/supabase.client';
import { attachmentSchema, PatientAttachment } from '../schemas/attachment.schema';

export class StorageRepository {
  /**
   * Upload an attachment to private Supabase Storage and register metadata + audit log
   */
  static async uploadAttachment(params: {
    file: File;
    patientId: string;
    organizationId: string;
    actorId?: string;
  }): Promise<PatientAttachment> {
    // 1. Validar via Zod Schema
    const validated = attachmentSchema.parse({
      fileName: params.file.name,
      fileSize: params.file.size,
      mimeType: params.file.type,
      patientId: params.patientId,
      organizationId: params.organizationId,
    });

    const fileExt = validated.fileName.split('.').pop() || 'bin';
    const uniquePath = `${validated.organizationId}/${validated.patientId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    // 2. Upload para o bucket privado 'clinical-attachments'
    const { data: storageData, error: storageError } = await supabase.storage
      .from('clinical-attachments')
      .upload(uniquePath, params.file, {
        contentType: validated.mimeType,
        cacheControl: '3600',
        upsert: false,
      });

    if (storageError || !storageData) {
      throw new Error(`Falha no upload do arquivo: ${storageError?.message || 'Erro desconhecido'}`);
    }

    // 3. Inserir metadados no banco PostgreSQL
    const { data: dbData, error: dbError } = await supabase
      .from('patient_attachments')
      .insert({
        organization_id: validated.organizationId,
        patient_id: validated.patientId,
        file_name: validated.fileName,
        file_path: storageData.path,
        file_size: validated.fileSize,
        mime_type: validated.mimeType,
        created_by: params.actorId,
      })
      .select('*')
      .single();

    if (dbError || !dbData) {
      // Rollback manual do arquivo se a gravação do metadado falhar
      await supabase.storage.from('clinical-attachments').remove([storageData.path]);
      throw new Error(`Falha ao registrar anexo no banco: ${dbError?.message}`);
    }

    // 4. Audit Log imutável (Regra 34)
    if (params.actorId) {
      await supabase.from('audit_logs').insert({
        organization_id: validated.organizationId,
        actor_id: params.actorId,
        action: 'ATTACHMENT_UPLOAD',
        resource_type: 'patient_attachments',
        resource_id: dbData.id,
      });
    }

    return {
      id: dbData.id,
      organizationId: dbData.organization_id,
      patientId: dbData.patient_id,
      fileName: dbData.file_name,
      filePath: dbData.file_path,
      fileSize: dbData.file_size,
      mimeType: dbData.mime_type,
      createdAt: dbData.created_at,
      createdBy: dbData.created_by,
    };
  }

  /**
   * Gerar URL presigned temporária (expira em 1 hora) para download/visualização segura
   */
  static async getSignedUrl(filePath: string, expiresInSeconds: number = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from('clinical-attachments')
      .createSignedUrl(filePath, expiresInSeconds);

    if (error || !data) {
      throw new Error(`Falha ao gerar URL temporária: ${error?.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Listar anexos de um paciente
   */
  static async listPatientAttachments(patientId: string): Promise<PatientAttachment[]> {
    const { data, error } = await supabase
      .from('patient_attachments')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao listar anexos: ${error.message}`);
    }

    return (data || []).map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      patientId: row.patient_id,
      fileName: row.file_name,
      filePath: row.file_path,
      fileSize: row.file_size,
      mimeType: row.mime_type,
      createdAt: row.created_at,
      createdBy: row.created_by,
    }));
  }

  /**
   * Excluir um anexo (Storage + DB + Audit Log)
   */
  static async deleteAttachment(params: {
    attachmentId: string;
    filePath: string;
    organizationId: string;
    actorId?: string;
  }): Promise<void> {
    // 1. Remover do Storage
    await supabase.storage.from('clinical-attachments').remove([params.filePath]);

    // 2. Remover da tabela
    const { error } = await supabase
      .from('patient_attachments')
      .delete()
      .eq('id', params.attachmentId);

    if (error) {
      throw new Error(`Erro ao remover anexo: ${error.message}`);
    }

    // 3. Audit Log (Regra 34)
    if (params.actorId) {
      await supabase.from('audit_logs').insert({
        organization_id: params.organizationId,
        actor_id: params.actorId,
        action: 'ATTACHMENT_DELETE',
        resource_type: 'patient_attachments',
        resource_id: params.attachmentId,
      });
    }
  }
}
