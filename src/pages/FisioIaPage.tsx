import React, { useState } from 'react';
import { ShieldCheck, Send, AlertTriangle, Sparkles, CheckCircle } from 'lucide-react';
import { validateAndSanitizeFisioIAResponse, FisioIAResponse } from '@/shared/lib/security/sanitizer';

export const FisioIaPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<FisioIAResponse | null>(null);

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    // Simulação do AI Gateway seguro via Backend / BFF (Sec. 20 do Plano)
    setTimeout(() => {
      try {
        const mockRawBackendResponse = {
          summary: `Análise clínica estruturada para o quadro: "${prompt}". Recomenda-se a avaliação contínua da mecânica ventilatória e condutas baseadas em evidências.`,
          alerts: [
            'Verificar contraindicações de mobilização precoce se houver instabilidade hemodinâmica (PAM < 65 mmHg).',
            'Manter monitorização contínua de SpO2 e capnografia se em ventilação mecânica.',
          ],
          references: [
            'Diretrizes Brasileiras de Fisioterapia Intensiva (ASSOBRAFIR, 2024)',
            'Evidence-based clinical practice guidelines for ICU rehabilitation',
          ],
          confidence: 0.95,
        };

        // Validação estrita de esquema Zod + Sanitização DOMPurify (Sec. 21)
        const validated = validateAndSanitizeFisioIAResponse(mockRawBackendResponse);
        setResponse(validated);
      } catch (err) {
        console.error('Falha na validação do AI Gateway:', err);
      } finally {
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          AI Gateway Seguro &amp; Saída Estruturada
        </div>
        <h1 className="text-2xl font-bold font-display text-white">FisioIA — Assistente Clínico</h1>
        <p className="text-xs text-slate-400">
          Consultas assistidas por IA com validação de esquema Zod, guardrails de segurança e sanitização estrita.
        </p>
      </div>

      <form onSubmit={handleConsult} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <label htmlFor="prompt-input" className="block text-sm font-semibold text-white">
          Descreva a dúvida clínica ou o caso do paciente:
        </label>
        <textarea
          id="prompt-input"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Paciente de 65 anos em VMI por SARA grave, PaO2/FiO2 = 120. Qual a estratégia de titulação de PEEP sugerida pelas diretrizes?"
          aria-label="Consulta para a FisioIA"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-rose-400 focus:outline-none placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-rose-400 focus:outline-none"
        >
          {loading ? (
            <span className="animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Processando no AI Gateway...
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" /> Consultar FisioIA
            </>
          )}
        </button>
      </form>

      {response && (
        <div
          role="region"
          aria-live="polite"
          aria-label="Resposta do FisioIA"
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-rose-400" aria-hidden="true" />
              Resposta Validada pelo AI Gateway
            </h2>
            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
              Confiança: {(response.confidence * 100).toFixed(0)}%
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">Resumo Clínico:</h3>
            <div
              className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800"
              dangerouslySetInnerHTML={{ __html: response.summary }}
            />
          </div>

          {response.alerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Alertasalertas de Segurança Clínica:
              </h3>
              <ul className="space-y-2">
                {response.alerts.map((alert, idx) => (
                  <li
                    key={idx}
                    className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 p-3 rounded-lg flex items-start gap-2"
                  >
                    <span>•</span>
                    <span dangerouslySetInnerHTML={{ __html: alert }} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400">Referências de Suporte:</h3>
            <ul className="text-xs text-slate-400 space-y-1">
              {response.references.map((ref, idx) => (
                <li key={idx}>[ {idx + 1} ] {ref}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
