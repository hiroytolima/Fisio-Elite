import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SofaSchema } from '@/modules/sofa/schemas/sofa.schema';
import { calculateSofa } from '@/modules/sofa/domain/calculateSofa';
import { sofaMetadata } from '@/modules/sofa/metadata/sofa.metadata';
import { SofaInput, SofaResult } from '@/modules/sofa/domain/sofa.types';
import { PatientsRepository } from '@/modules/patients/api/patients.repository';
import { Calculator, Info, CheckCircle2, ShieldAlert, Save } from 'lucide-react';

export const SofaPage: React.FC = () => {
  const [result, setResult] = useState<SofaResult | null>(null);
  const [patientIdInput, setPatientIdInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SofaInput>({
    resolver: zodResolver(SofaSchema),
    defaultValues: {
      pao2Fio2: 400,
      platelets: 200,
      bilirubin: 0.8,
      map: 85,
      vasopressors: 'none',
      glasgow: 15,
      creatinine: 0.9,
      urineOutput: 1500,
    },
  });

  const onSubmit = (data: SofaInput) => {
    const calculated = calculateSofa(data);
    setResult(calculated);
    setSaveStatus(null);
  };

  const handleSaveToPatient = async () => {
    if (!result) return;
    if (!patientIdInput.trim()) {
      setSaveStatus('Por favor, informe o ID do paciente.');
      return;
    }

    try {
      await PatientsRepository.saveAssessment({
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
        patientId: patientIdInput.trim(),
        evaluatorId: '00000000-0000-0000-0000-000000000000',
        moduleType: 'sofa',
        scoreData: result.breakdown as unknown as Record<string, unknown>,
        resultSummary: `SOFA: ${result.totalScore} pts (${result.mortalityRisk})`,
      });
      setSaveStatus('SOFA salvo com sucesso no prontuário!');
    } catch (err: unknown) {
      setSaveStatus(`Erro ao salvar: ${(err as Error).message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Topo do Módulo */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
          <Calculator className="w-4 h-4" aria-hidden="true" />
          Calculadora Clínica Versão {sofaMetadata.version}
        </div>
        <h1 className="text-2xl font-bold font-display text-white">{sofaMetadata.name}</h1>
        <p className="text-xs text-slate-400">
          Fórmula: {sofaMetadata.formulaVersion} • Revisado em {sofaMetadata.reviewedAt}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Clínico Acessível */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
            Parâmetros Fisiológicos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pao2Fio2" className="block text-xs font-medium text-slate-300 mb-1">
                PaO2 / FiO2 ({sofaMetadata.units.pao2Fio2})
              </label>
              <input
                id="pao2Fio2"
                type="number"
                step="any"
                {...register('pao2Fio2', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.pao2Fio2 && <p className="text-xs text-red-400 mt-1">{errors.pao2Fio2.message}</p>}
            </div>

            <div>
              <label htmlFor="platelets" className="block text-xs font-medium text-slate-300 mb-1">
                Plaquetas ({sofaMetadata.units.platelets})
              </label>
              <input
                id="platelets"
                type="number"
                step="any"
                {...register('platelets', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.platelets && <p className="text-xs text-red-400 mt-1">{errors.platelets.message}</p>}
            </div>

            <div>
              <label htmlFor="bilirubin" className="block text-xs font-medium text-slate-300 mb-1">
                Bilirrubina ({sofaMetadata.units.bilirubin})
              </label>
              <input
                id="bilirubin"
                type="number"
                step="any"
                {...register('bilirubin', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.bilirubin && <p className="text-xs text-red-400 mt-1">{errors.bilirubin.message}</p>}
            </div>

            <div>
              <label htmlFor="map" className="block text-xs font-medium text-slate-300 mb-1">
                Pressão Arterial Média — PAM ({sofaMetadata.units.map})
              </label>
              <input
                id="map"
                type="number"
                step="any"
                {...register('map', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.map && <p className="text-xs text-red-400 mt-1">{errors.map.message}</p>}
            </div>

            <div>
              <label htmlFor="vasopressors" className="block text-xs font-medium text-slate-300 mb-1">
                Vasopressores / Inotrópicos
              </label>
              <select
                id="vasopressors"
                {...register('vasopressors')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              >
                <option value="none">Nenhum</option>
                <option value="dobutamine">Dobutamina (qualquer dose)</option>
                <option value="dopamine_low">Dopamina ≤ 5 µg/kg/min</option>
                <option value="dopamine_med">Dopamina &gt; 5 µg/kg/min</option>
                <option value="dopamine_high">Dopamina &gt; 15 µg/kg/min</option>
                <option value="norepinephrine_low">Noradrenalina ≤ 0,1 µg/kg/min</option>
                <option value="norepinephrine_high">Noradrenalina &gt; 0,1 µg/kg/min</option>
              </select>
            </div>

            <div>
              <label htmlFor="glasgow" className="block text-xs font-medium text-slate-300 mb-1">
                Escala de Glasgow (3-15)
              </label>
              <input
                id="glasgow"
                type="number"
                {...register('glasgow', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.glasgow && <p className="text-xs text-red-400 mt-1">{errors.glasgow.message}</p>}
            </div>

            <div>
              <label htmlFor="creatinine" className="block text-xs font-medium text-slate-300 mb-1">
                Creatinina ({sofaMetadata.units.creatinine})
              </label>
              <input
                id="creatinine"
                type="number"
                step="any"
                {...register('creatinine', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.creatinine && <p className="text-xs text-red-400 mt-1">{errors.creatinine.message}</p>}
            </div>

            <div>
              <label htmlFor="urineOutput" className="block text-xs font-medium text-slate-300 mb-1">
                Débito Urinário ({sofaMetadata.units.urineOutput})
              </label>
              <input
                id="urineOutput"
                type="number"
                step="any"
                {...register('urineOutput', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.urineOutput && <p className="text-xs text-red-400 mt-1">{errors.urineOutput.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-teal-400 focus:outline-none mt-4"
          >
            Calcular Pontuação SOFA
          </button>
        </form>

        {/* Resultado Clínico com Região aria-live Estável (Sec. 8 do Plano) */}
        <div className="space-y-4">
          <div
            role="region"
            aria-live="polite"
            aria-label="Resultado da Avaliação SOFA"
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
          >
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" aria-hidden="true" />
              Resultado Clínico
            </h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-800">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Pontuação Total SOFA</div>
                  <div className="text-4xl font-extrabold font-display text-teal-400 mt-1">
                    {result.totalScore} pts
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Prognóstico Estimado
                  </div>
                  <p className="text-sm font-medium text-slate-200">{result.mortalityRisk}</p>
                </div>

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
              <p className="text-xs text-slate-500 text-center py-8">
                Preencha os valores fisiológicos e clique em &quot;Calcular&quot; para visualizar o escore.
              </p>
            )}
          </div>

          {/* Referências Bibliográficas */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-teal-400" /> Referência Científica:
            </div>
            {sofaMetadata.references.map((ref, idx) => (
              <p key={idx} className="text-slate-400">
                {ref.citation}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
