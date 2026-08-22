import React, { useState } from 'react';
import { UserPlus, Users, Search, Activity, FileText, Calendar, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Patient, CreatePatientInput, CreatePatientSchema } from '@/modules/patients/schemas/patient.schema';

// Pacientes sintéticos de demonstração para a Fase 8
const INITIAL_PATIENTS: Patient[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    organizationId: '123e4567-e89b-12d3-a456-426614174000',
    fullName: 'Carlos Eduardo Santos',
    medicalRecordNumber: 'PRON-2026-081',
    birthDate: '1968-05-14',
    gender: 'male',
    bedNumber: 'UTI-Leito 03',
    admissionDate: '2026-08-18T10:30:00Z',
    diagnosis: 'Pneumonia Grave com Insuficiência Respiratória Aguda (SDRA)',
    status: 'active',
    createdAt: '2026-08-18T10:30:00Z',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    organizationId: '123e4567-e89b-12d3-a456-426614174000',
    fullName: 'Maria de Fátima Oliveira',
    medicalRecordNumber: 'PRON-2026-094',
    birthDate: '1975-11-22',
    gender: 'female',
    bedNumber: 'UTI-Leito 07',
    admissionDate: '2026-08-19T14:15:00Z',
    diagnosis: 'Pós-Operatório de Cirurgia Torácica / Mobilização Precoce',
    status: 'active',
    createdAt: '2026-08-19T14:15:00Z',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    organizationId: '123e4567-e89b-12d3-a456-426614174000',
    fullName: 'Roberto Albuquerque',
    medicalRecordNumber: 'PRON-2026-042',
    birthDate: '1954-01-30',
    gender: 'male',
    bedNumber: 'Leito 12',
    admissionDate: '2026-08-10T08:00:00Z',
    diagnosis: 'DPOC Exacerbado com Hipoxemia',
    status: 'discharged',
    createdAt: '2026-08-10T08:00:00Z',
  },
];

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const defaultDate = new Date().toISOString().split('T')[0] || '';

  // Form State
  const [formData, setFormData] = useState<CreatePatientInput>({
    organizationId: '123e4567-e89b-12d3-a456-426614174000',
    fullName: '',
    medicalRecordNumber: '',
    birthDate: '',
    gender: 'male',
    bedNumber: '',
    admissionDate: defaultDate,
    diagnosis: '',
    status: 'active',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.medicalRecordNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.bedNumber && p.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = CreatePatientSchema.safeParse(formData);
    if (!validation.success) {
      setFormError(validation.error.errors[0]?.message || 'Erro de validação');
      return;
    }

    const newPatient: Patient = {
      ...validation.data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPatients([newPatient, ...patients]);
    setIsModalOpen(false);
    setFormData({
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      fullName: '',
      medicalRecordNumber: '',
      birthDate: '',
      gender: 'male',
      bedNumber: '',
      admissionDate: defaultDate,
      diagnosis: '',
      status: 'active',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30 mb-2">
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            Fase 8 — Gestão de Pacientes & Prontuários
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Pacientes &amp; Leitos da UTI</h1>
          <p className="text-slate-400 text-sm">
            Prontuários eletrônicos com rastreabilidade clínica e proteção de isolamento via RLS.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-teal-600/20 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          Novo Paciente
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar por nome, leito ou prontuário..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Grid de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => setSelectedPatient(patient)}
            className={`bg-slate-900 border rounded-2xl p-5 cursor-pointer transition-all hover:border-teal-500/50 ${
              selectedPatient?.id === patient.id ? 'border-teal-500 bg-slate-900/90 ring-1 ring-teal-500' : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-teal-400 border border-slate-700">
                  {patient.bedNumber || 'Sem Leito'}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5 line-clamp-1">{patient.fullName}</h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                  patient.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {patient.status === 'active' ? 'Ativo' : 'Alta'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Prontuário: <strong className="text-slate-300">{patient.medicalRecordNumber}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Admissão: {new Date(patient.admissionDate).toLocaleDateString('pt-BR')}</span>
              </div>
              {patient.diagnosis && (
                <p className="mt-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 line-clamp-2">
                  {patient.diagnosis}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Drawer / Prontuário Selecionado */}
      {selectedPatient && (
        <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-teal-400 font-semibold uppercase tracking-wider">Prontuário em Foco</span>
              <h2 className="text-xl font-bold text-white">{selectedPatient.fullName}</h2>
              <p className="text-xs text-slate-400">Leito: {selectedPatient.bedNumber} | Prontuário: {selectedPatient.medicalRecordNumber}</p>
            </div>
            <button
              onClick={() => setSelectedPatient(null)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800"
            >
              Fechar Detalhes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <strong className="text-slate-400 block text-xs mb-1">Diagnóstico Clínico Principal:</strong>
              <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200">
                {selectedPatient.diagnosis || 'Nenhum diagnóstico registrado.'}
              </p>
            </div>
            <div>
              <strong className="text-slate-400 block text-xs mb-1">Ações Rápidas de Avaliação:</strong>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-medium flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Escore SOFA
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-medium flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> CAM-ICU (Delirium)
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-medium flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> PERME Mobilidade
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Paciente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-teal-400" />
                Cadastrar Novo Paciente
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePatient} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ex: João da Silva"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nº Prontuário *</label>
                  <input
                    type="text"
                    required
                    value={formData.medicalRecordNumber}
                    onChange={(e) => setFormData({ ...formData, medicalRecordNumber: e.target.value })}
                    placeholder="PRON-2026-00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Leito UTI</label>
                  <input
                    type="text"
                    value={formData.bedNumber}
                    onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                    placeholder="UTI-01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Diagnóstico Clínico Principal</label>
                <textarea
                  rows={2}
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Descreva o quadro clínico..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Salvar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
