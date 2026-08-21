import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { calculateGlasgow } from '@/modules/glasgow/domain/calculateGlasgow';
import { glasgowMetadata } from '@/modules/glasgow/metadata/glasgow.metadata';
import { GlasgowInput, GlasgowResult } from '@/modules/glasgow/domain/glasgow.types';
import { Brain, CheckCircle2, AlertOctagon, Info } from 'lucide-react';

export const GlasgowPage: React.FC = () => {
  const [result, setResult] = useState<GlasgowResult | null>(null);

  const { register, handleSubmit } = useForm<GlasgowInput>({
    defaultValues: {
      eyeOpening: 4,
      verbalResponse: 5,
      motorResponse: 6,
      pupillaryReactivity: 0,
    },
  });

  const onSubmit = (data: GlasgowInput) => {
    const calculated = calculateGlasgow({
      eyeOpening: Number(data.eyeOpening) as GlasgowInput['eyeOpening'],
      verbalResponse: Number(data.verbalResponse) as GlasgowInput['verbalResponse'],
      motorResponse: Number(data.motorResponse) as GlasgowInput['motorResponse'],
      pupillaryReactivity: Number(data.pupillaryReactivity) as GlasgowInput['pupillaryReactivity'],
    });
    setResult(calculated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
          <Brain className="w-4 h-4" aria-hidden="true" />
          Avaliação Neurológica Versão {glasgowMetadata.version}
        </div>
        <h1 className="text-2xl font-bold font-display text-white">{glasgowMetadata.name}</h1>
        <p className="text-xs text-slate-400">
          Fórmula: {glasgowMetadata.formulaVersion} • Revisado em {glasgowMetadata.reviewedAt}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-2">
            Componentes de Resposta
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="eyeOpening" className="block text-xs font-medium text-slate-300 mb-1">
                Abertura Ocular (AO)
              </label>
              <select
                id="eyeOpening"
                {...register('eyeOpening')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value={4}>4 — Espontânea</option>
                <option value={3}>3 — À ordem verbal</option>
                <option value={2}>2 — À pressão/dor</option>
                <option value={1}>1 — Nenhuma</option>
              </select>
            </div>

            <div>
              <label htmlFor="verbalResponse" className="block text-xs font-medium text-slate-300 mb-1">
                Resposta Verbal (RV)
              </label>
              <select
                id="verbalResponse"
                {...register('verbalResponse')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value={5}>5 — Orientado</option>
                <option value={4}>4 — Confuso</option>
                <option value={3}>3 — Palavras inadequadas</option>
                <option value={2}>2 — Sons incompreensíveis</option>
                <option value={1}>1 — Nenhuma</option>
              </select>
            </div>

            <div>
              <label htmlFor="motorResponse" className="block text-xs font-medium text-slate-300 mb-1">
                Resposta Motora (RM)
              </label>
              <select
                id="motorResponse"
                {...register('motorResponse')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value={6}>6 — Obedece a comandos</option>
                <option value={5}>5 — Localiza a dor</option>
                <option value={4}>4 — Flexão normal (retirada)</option>
                <option value={3}>3 — Flexão anormal (decorticação)</option>
                <option value={2}>2 — Extensão anormal (descerebração)</option>
                <option value={1}>1 — Nenhuma</option>
              </select>
            </div>

            <div>
              <label htmlFor="pupillaryReactivity" className="block text-xs font-medium text-slate-300 mb-1">
                Reatividade Pupilar (GCS-P)
              </label>
              <select
                id="pupillaryReactivity"
                {...register('pupillaryReactivity')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value={0}>0 — Ambas as pupilas reativas</option>
                <option value={1}>1 — Apenas uma pupila reativa (-1 ponto)</option>
                <option value={2}>2 — Nenhuma pupila reativa (-2 pontos)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-purple-400 focus:outline-none mt-4"
          >
            Calcular Glasgow (GCS-P)
          </button>
        </form>

        <div className="space-y-4">
          <div
            role="region"
            aria-live="polite"
            aria-label="Resultado da Escala de Glasgow"
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
          >
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-400" aria-hidden="true" />
              Pontuação Glasgow
            </h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-800">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Escore GCS / GCS-P</div>
                  <div className="text-4xl font-extrabold font-display text-purple-400 mt-1">
                    {result.gcsPScore !== undefined ? result.gcsPScore : result.totalScore} / 15
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4" />
                    {result.severity}
                  </div>
                  <p className="text-xs text-slate-300">{result.recommendation}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">
                Selecione as respostas para calcular a pontuação de Glasgow.
              </p>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-purple-400" /> Referência:
            </div>
            {glasgowMetadata.references.map((ref, idx) => (
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
