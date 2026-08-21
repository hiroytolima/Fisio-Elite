import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GasometriaSchema } from '@/modules/gasometria/schemas/gasometria.schema';
import { calculateGasometria } from '@/modules/gasometria/domain/calculateGasometria';
import { gasometriaMetadata } from '@/modules/gasometria/metadata/gasometria.metadata';
import { GasometriaInput, GasometriaResult } from '@/modules/gasometria/domain/gasometria.types';
import { Stethoscope, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const GasometriaPage: React.FC = () => {
  const [result, setResult] = useState<GasometriaResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GasometriaInput>({
    resolver: zodResolver(GasometriaSchema),
    defaultValues: {
      ph: 7.40,
      paco2: 40,
      hco3: 24,
      pao2: 95,
      fio2: 21,
    },
  });

  const onSubmit = (data: GasometriaInput) => {
    const calculated = calculateGasometria(data);
    setResult(calculated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
          <Stethoscope className="w-4 h-4" aria-hidden="true" />
          Análise de Gasometria Versão {gasometriaMetadata.version}
        </div>
        <h1 className="text-2xl font-bold font-display text-white">{gasometriaMetadata.name}</h1>
        <p className="text-xs text-slate-400">
          Fórmula: {gasometriaMetadata.formulaVersion} • Revisado em {gasometriaMetadata.reviewedAt}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
            Valores de Gasometria Arterial
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ph" className="block text-xs font-medium text-slate-300 mb-1">
                pH Arterial (7.35 - 7.45)
              </label>
              <input
                id="ph"
                type="number"
                step="any"
                {...register('ph', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.ph && <p className="text-xs text-red-400 mt-1">{errors.ph.message}</p>}
            </div>

            <div>
              <label htmlFor="paco2" className="block text-xs font-medium text-slate-300 mb-1">
                PaCO2 (mmHg)
              </label>
              <input
                id="paco2"
                type="number"
                step="any"
                {...register('paco2', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.paco2 && <p className="text-xs text-red-400 mt-1">{errors.paco2.message}</p>}
            </div>

            <div>
              <label htmlFor="hco3" className="block text-xs font-medium text-slate-300 mb-1">
                HCO3- (mEq/L)
              </label>
              <input
                id="hco3"
                type="number"
                step="any"
                {...register('hco3', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.hco3 && <p className="text-xs text-red-400 mt-1">{errors.hco3.message}</p>}
            </div>

            <div>
              <label htmlFor="pao2" className="block text-xs font-medium text-slate-300 mb-1">
                PaO2 (mmHg)
              </label>
              <input
                id="pao2"
                type="number"
                step="any"
                {...register('pao2', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.pao2 && <p className="text-xs text-red-400 mt-1">{errors.pao2.message}</p>}
            </div>

            <div>
              <label htmlFor="fio2" className="block text-xs font-medium text-slate-300 mb-1">
                FiO2 (%)
              </label>
              <input
                id="fio2"
                type="number"
                step="any"
                {...register('fio2', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
              {errors.fio2 && <p className="text-xs text-red-400 mt-1">{errors.fio2.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-teal-400 focus:outline-none mt-4"
          >
            Analisar Gasometria
          </button>
        </form>

        <div className="space-y-4">
          <div
            role="region"
            aria-live="polite"
            aria-label="Laudo da Gasometria Arterial"
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
          >
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" aria-hidden="true" />
              Laudo Fisiológico
            </h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Distúrbio Ácido-Básico</div>
                  <div className="text-base font-bold font-display text-teal-400">
                    {result.disturbio}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400">Oxigenação</span>
                    <p className="font-bold text-white mt-0.5">{result.oxigenacao}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400">PaO2 / FiO2</span>
                    <p className="font-bold text-teal-400 mt-0.5">{result.relacaoPao2Fio2}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Recomendação
                  </div>
                  <p className="text-xs text-slate-300">{result.recommendation}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">
                Informe os parâmetros de pH, PaCO2, HCO3, PaO2 e FiO2 para gerar o laudo.
              </p>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-teal-400" /> Referência:
            </div>
            {gasometriaMetadata.references.map((ref, idx) => (
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
