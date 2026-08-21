import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoxSchema } from '@/modules/rox/schemas/rox.schema';
import { calculateRox } from '@/modules/rox/domain/calculateRox';
import { roxMetadata } from '@/modules/rox/metadata/rox.metadata';
import { RoxInput, RoxResult } from '@/modules/rox/domain/rox.types';
import { HeartPulse, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const RoxPage: React.FC = () => {
  const [result, setResult] = useState<RoxResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoxInput>({
    resolver: zodResolver(RoxSchema),
    defaultValues: {
      spo2: 95,
      fio2: 50,
      rr: 22,
    },
  });

  const onSubmit = (data: RoxInput) => {
    const calculated = calculateRox(data);
    setResult(calculated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
          <HeartPulse className="w-4 h-4" aria-hidden="true" />
          Calculadora Clínica Versão {roxMetadata.version}
        </div>
        <h1 className="text-2xl font-bold font-display text-white">{roxMetadata.name}</h1>
        <p className="text-xs text-slate-400">
          Fórmula: {roxMetadata.formulaVersion} • Revisado em {roxMetadata.reviewedAt}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
            Entrada de Dados Respiratórios
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="spo2" className="block text-xs font-medium text-slate-300 mb-1">
                Saturação de Oxigênio — SpO2 ({roxMetadata.units.spo2})
              </label>
              <input
                id="spo2"
                type="number"
                step="any"
                {...register('spo2', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {errors.spo2 && <p className="text-xs text-red-400 mt-1">{errors.spo2.message}</p>}
            </div>

            <div>
              <label htmlFor="fio2" className="block text-xs font-medium text-slate-300 mb-1">
                Fração Inspirada de O2 — FiO2 ({roxMetadata.units.fio2})
              </label>
              <input
                id="fio2"
                type="number"
                step="any"
                {...register('fio2', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {errors.fio2 && <p className="text-xs text-red-400 mt-1">{errors.fio2.message}</p>}
            </div>

            <div>
              <label htmlFor="rr" className="block text-xs font-medium text-slate-300 mb-1">
                Frequência Respiratória — FR ({roxMetadata.units.rr})
              </label>
              <input
                id="rr"
                type="number"
                {...register('rr', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {errors.rr && <p className="text-xs text-red-400 mt-1">{errors.rr.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none mt-4"
          >
            Calcular Índice ROX
          </button>
        </form>

        <div className="space-y-4">
          <div
            role="region"
            aria-live="polite"
            aria-label="Resultado do Índice ROX"
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
          >
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" aria-hidden="true" />
              Resultado
            </h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-800">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Índice ROX</div>
                  <div className="text-4xl font-extrabold font-display text-blue-400 mt-1">
                    {result.roxIndex}
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    {result.riskCategory}
                  </div>
                  <p className="text-xs text-slate-300">{result.recommendation}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">
                Informe SpO2, FiO2 e FR para calcular o risco de falha da CNOF.
              </p>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-400" /> Referência:
            </div>
            {roxMetadata.references.map((ref, idx) => (
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
