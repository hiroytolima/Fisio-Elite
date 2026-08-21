import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HacorSchema } from '@/modules/hacor/schemas/hacor.schema';
import { calculateHacor } from '@/modules/hacor/domain/calculateHacor';
import { hacorMetadata } from '@/modules/hacor/metadata/hacor.metadata';
import { HacorInput, HacorResult } from '@/modules/hacor/domain/hacor.types';
import { Activity, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const HacorPage: React.FC = () => {
  const [result, setResult] = useState<HacorResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HacorInput>({
    resolver: zodResolver(HacorSchema),
    defaultValues: {
      hr: 95,
      ph: 7.38,
      gcs: 15,
      pao2Fio2: 250,
      rr: 24,
    },
  });

  const onSubmit = (data: HacorInput) => {
    const calculated = calculateHacor(data);
    setResult(calculated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <Activity className="w-4 h-4" aria-hidden="true" />
          Predição de Falha de VNI Versão {hacorMetadata.version}
        </div>
        <h1 className="text-2xl font-bold font-display text-white">{hacorMetadata.name}</h1>
        <p className="text-xs text-slate-400">
          Fórmula: {hacorMetadata.formulaVersion} • Revisado em {hacorMetadata.reviewedAt}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
            Entrada de Parâmetros Clínicos
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="hr" className="block text-xs font-medium text-slate-300 mb-1">
                Frequência Cardíaca — FC (bpm)
              </label>
              <input
                id="hr"
                type="number"
                {...register('hr', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              {errors.hr && <p className="text-xs text-red-400 mt-1">{errors.hr.message}</p>}
            </div>

            <div>
              <label htmlFor="ph" className="block text-xs font-medium text-slate-300 mb-1">
                pH Arterial
              </label>
              <input
                id="ph"
                type="number"
                step="any"
                {...register('ph', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              {errors.ph && <p className="text-xs text-red-400 mt-1">{errors.ph.message}</p>}
            </div>

            <div>
              <label htmlFor="gcs" className="block text-xs font-medium text-slate-300 mb-1">
                Escala de Glasgow (3-15)
              </label>
              <input
                id="gcs"
                type="number"
                {...register('gcs', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              {errors.gcs && <p className="text-xs text-red-400 mt-1">{errors.gcs.message}</p>}
            </div>

            <div>
              <label htmlFor="pao2Fio2" className="block text-xs font-medium text-slate-300 mb-1">
                PaO2 / FiO2 (mmHg)
              </label>
              <input
                id="pao2Fio2"
                type="number"
                step="any"
                {...register('pao2Fio2', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              {errors.pao2Fio2 && <p className="text-xs text-red-400 mt-1">{errors.pao2Fio2.message}</p>}
            </div>

            <div>
              <label htmlFor="rr" className="block text-xs font-medium text-slate-300 mb-1">
                Frequência Respiratória — FR (irpm)
              </label>
              <input
                id="rr"
                type="number"
                {...register('rr', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              {errors.rr && <p className="text-xs text-red-400 mt-1">{errors.rr.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-amber-400 focus:outline-none mt-4"
          >
            Calcular Escore HACOR
          </button>
        </form>

        <div className="space-y-4">
          <div
            role="region"
            aria-live="polite"
            aria-label="Resultado do Escore HACOR"
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
          >
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" aria-hidden="true" />
              Resultado HACOR
            </h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-800">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Pontuação Total</div>
                  <div className="text-4xl font-extrabold font-display text-amber-400 mt-1">
                    {result.totalScore} pts
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    {result.failureRisk}
                  </div>
                  <p className="text-xs text-slate-300">{result.recommendation}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">
                Informe FC, pH, Glasgow, PaO2/FiO2 e FR para calcular o risco de falha da VNI.
              </p>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-400" /> Referência:
            </div>
            {hacorMetadata.references.map((ref, idx) => (
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
