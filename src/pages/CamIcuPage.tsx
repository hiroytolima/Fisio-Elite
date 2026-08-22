import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CamIcuSchema } from '@/modules/cam-icu/schemas/camIcu.schema';
import { calculateCamIcu } from '@/modules/cam-icu/domain/calculateCamIcu';
import { camIcuMetadata } from '@/modules/cam-icu/metadata/camIcu.metadata';
import { CamIcuInput, CamIcuResult } from '@/modules/cam-icu/domain/camIcu.types';
import { PatientsRepository } from '@/modules/patients/api/patients.repository';
import { Brain, CheckCircle2, ShieldAlert, Save, Info } from 'lucide-react';

export const CamIcuPage: React.FC = () => {
  const [result, setResult] = useState<CamIcuResult | null>(null);
  const [patientIdInput, setPatientIdInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<CamIcuInput>({
    resolver: zodResolver(CamIcuSchema),
    defaultValues: {
      acuteOnsetOrFluctuating: false,
      inattention: false,
      alteredLevelOfConsciousness: false,
      disorganizedThinking: false,
    },
  });

  const formValues = watch();

  const onSubmit = (data: CamIcuInput) => {
    const calculated = calculateCamIcu(data);
    setResult(calculated);
    setSaveStatus(null);
  };

  const handleSaveToPatient = async () => {
    if (!result) return;
    if (!patientIdInput.trim()) {
      setSaveStatus('Por favor, informe o ID ou selecione um paciente para gravar a avaliação.');
      return;
    }

    try {
      await PatientsRepository.saveAssessment({
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
        patientId: patientIdInput.trim(),
        evaluatorId: '00000000-0000-0000-0000-000000000000',
        moduleType: 'cam-icu',
        scoreData: result.featuresPresent as unknown as Record<string, unknown>,
        resultSummary: result.clinicalSummary,
      });
      setSaveStatus('Avaliação salva com sucesso no prontuário do paciente (Audit Log registrado).');
    } catch (err: unknown) {
      setSaveStatus(`Erro ao salvar no banco: ${(err as Error).message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner Superior do Módulo */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
          <Brain className="w-4 h-4" aria-hidden="true" />
          Avaliação Neurológica / UTI • Versão {camIcuMetadata.version}
        </div>
        <h1 className="text-2xl font-bold font-display text-white">{camIcuMetadata.name}</h1>
        <p className="text-xs text-slate-400">
          Algoritmo: {camIcuMetadata.formulaVersion} • Revisado em {camIcuMetadata.reviewedAt}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Interativo CAM-ICU */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
            Features do Algoritmo CAM-ICU
          </h2>

          {/* Feature 1 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Característica 1</span>
                <h3 className="text-sm font-bold text-white">Início Agudo ou Curso Flutuante</h3>
                <p className="text-xs text-slate-400">Há evidência de alteração súbita no estado mental em relação ao basal?</p>
              </div>
              <input
                type="checkbox"
                id="acuteOnsetOrFluctuating"
                checked={formValues.acuteOnsetOrFluctuating}
                onChange={(e) => setValue('acuteOnsetOrFluctuating', e.target.checked)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Característica 2</span>
                <h3 className="text-sm font-bold text-white">Inatenção (Teste ASE)</h3>
                <p className="text-xs text-slate-400">Dificuldade em focar a atenção (ex: menos de 8 acertos no teste de apreensão de letras)?</p>
              </div>
              <input
                type="checkbox"
                id="inattention"
                checked={formValues.inattention}
                onChange={(e) => setValue('inattention', e.target.checked)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Característica 3</span>
                <h3 className="text-sm font-bold text-white">Nível Alterado de Consciência</h3>
                <p className="text-xs text-slate-400">Escore RASS atual é diferente de 0 (alerta e calmo)? Ex: sonolento, hiperativo ou sedado.</p>
              </div>
              <input
                type="checkbox"
                id="alteredLevelOfConsciousness"
                checked={formValues.alteredLevelOfConsciousness}
                onChange={(e) => setValue('alteredLevelOfConsciousness', e.target.checked)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer mt-1"
              />
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Característica 4</span>
                <h3 className="text-sm font-bold text-white">Pensamento Desorganizado</h3>
                <p className="text-xs text-slate-400">Respostas ilógicas a perguntas simples ou incapacidade de seguir comandos motores?</p>
              </div>
              <input
                type="checkbox"
                id="disorganizedThinking"
                checked={formValues.disorganizedThinking}
                onChange={(e) => setValue('disorganizedThinking', e.target.checked)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer mt-1"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-teal-600/20 text-sm flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4" /> Processar Algoritmo CAM-ICU
          </button>
        </form>

        {/* Resultado & Integração com Prontuário */}
        <div className="space-y-4">
          {result ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">Resultado Clínico</h2>

              <div
                className={`p-4 rounded-xl border flex items-center gap-3 ${
                  result.hasDelirium
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {result.hasDelirium ? (
                  <ShieldAlert className="w-6 h-6 shrink-0 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
                )}
                <div>
                  <span className="text-xs uppercase font-semibold block">Classificação</span>
                  <strong className="text-base font-extrabold">
                    {result.hasDelirium ? 'CAM-ICU POSITIVO (Delirium)' : 'CAM-ICU NEGATIVO'}
                  </strong>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                {result.clinicalSummary}
              </p>

              {/* Gravação no Prontuário do Paciente */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <label className="block text-xs font-medium text-slate-400">ID ou Prontuário do Paciente:</label>
                <input
                  type="text"
                  placeholder="Cole o ID do paciente aqui..."
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                />

                <button
                  type="button"
                  onClick={handleSaveToPatient}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Save className="w-4 h-4 text-teal-400" /> Salvar no Prontuário
                </button>

                {saveStatus && (
                  <p className="text-xs text-teal-300 bg-teal-500/10 p-2.5 rounded-lg border border-teal-500/30">
                    {saveStatus}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-2 text-slate-400">
              <Info className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">Preencha as características ao lado para calcular o estado de Delirium em UTI.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
