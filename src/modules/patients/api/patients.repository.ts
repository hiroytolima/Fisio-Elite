import { supabase } from '../../../shared/api/supabase.client';
import { CreatePatientInput, Patient } from '../schemas/patient.schema';

export interface AssessmentRecord {
  id: string;
  organizationId: string;
  patientId: string;
  evaluatorId: string;
  moduleType: string;
  scoreData: Record<string, unknown>;
  resultSummary: string;
  createdAt: string;
}

export class PatientsRepository {
  /**
   * Buscar lista de pacientes da organização (Protegido por RLS)
   */
  static async listByOrganization(organizationId: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar pacientes: ${error.message}`);
    }

    return (data || []).map(this.mapDbToModel);
  }

  /**
   * Buscar paciente por ID com verificação de autorização RLS
   */
  static async getById(patientId: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Erro ao buscar paciente: ${error.message}`);
    }

    return this.mapDbToModel(data);
  }

  /**
   * Cadastrar novo paciente com validação Zod e RLS
   */
  static async create(input: CreatePatientInput): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .insert({
        organization_id: input.organizationId,
        full_name: input.fullName,
        medical_record_number: input.medicalRecordNumber,
        birth_date: input.birthDate || null,
        gender: input.gender || null,
        bed_number: input.bedNumber || null,
        admission_date: input.admissionDate,
        diagnosis: input.diagnosis || null,
        status: input.status,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar paciente: ${error.message}`);
    }

    // Gerar registro no Audit Log
    await this.logAuditEvent(input.organizationId, 'patient.create', 'patient', data.id, {
      medicalRecordNumber: input.medicalRecordNumber,
    });

    return this.mapDbToModel(data);
  }

  /**
   * Salvar avaliação clínica do paciente (SOFA, ROX, PERME, etc.)
   */
  static async saveAssessment(assessment: {
    organizationId: string;
    patientId: string;
    evaluatorId: string;
    moduleType: string;
    scoreData: Record<string, unknown>;
    resultSummary: string;
  }): Promise<AssessmentRecord> {
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        organization_id: assessment.organizationId,
        patient_id: assessment.patientId,
        evaluator_id: assessment.evaluatorId,
        module_type: assessment.moduleType,
        score_data: assessment.scoreData,
        result_summary: assessment.resultSummary,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao salvar avaliação clínica: ${error.message}`);
    }

    await this.logAuditEvent(assessment.organizationId, 'assessment.create', 'assessment', data.id, {
      patientId: assessment.patientId,
      moduleType: assessment.moduleType,
    });

    return {
      id: data.id,
      organizationId: data.organization_id,
      patientId: data.patient_id,
      evaluatorId: data.evaluator_id,
      moduleType: data.module_type,
      scoreData: data.score_data,
      resultSummary: data.result_summary,
      createdAt: data.created_at,
    };
  }

  /**
   * Buscar histórico de avaliações clínicas de um paciente
   */
  static async listAssessments(patientId: string): Promise<AssessmentRecord[]> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar histórico de avaliações: ${error.message}`);
    }

    return (data || []).map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      patientId: row.patient_id,
      evaluatorId: row.evaluator_id,
      moduleType: row.module_type,
      scoreData: row.score_data,
      resultSummary: row.result_summary,
      createdAt: row.created_at,
    }));
  }

  private static logAuditEvent(
    organizationId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    metadata: Record<string, unknown>
  ) {
    return supabase.from('audit_logs').insert({
      organization_id: organizationId,
      actor_id: (supabase.auth.getUser() as unknown as { data: { user: { id: string } } })?.data?.user?.id || '00000000-0000-0000-0000-000000000000',
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static mapDbToModel(row: any): Patient {
    return {
      id: row.id,
      organizationId: row.organization_id,
      fullName: row.full_name,
      medicalRecordNumber: row.medical_record_number,
      birthDate: row.birth_date || undefined,
      gender: row.gender || undefined,
      bedNumber: row.bed_number || undefined,
      admissionDate: row.admission_date,
      diagnosis: row.diagnosis || undefined,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
