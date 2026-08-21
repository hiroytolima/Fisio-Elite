import React from 'react';
import { Link } from 'react-router';
import { Calculator, Brain, Layers, BookOpen, ShieldCheck, HeartPulse, Stethoscope } from 'lucide-react';

export const HomePage: React.FC = () => {
  const modules = [
    {
      title: 'Escore SOFA',
      description: 'Sequential Organ Failure Assessment para disfunção orgânica em UTI.',
      path: '/sofa',
      icon: Calculator,
      tag: 'UTI / Intensiva',
      color: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    },
    {
      title: 'Índice ROX',
      description: 'Predictor de falha da Cânula Nasal de Alto Fluxo (CNOF).',
      path: '/rox',
      icon: HeartPulse,
      tag: 'Respiratória',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      title: 'Escala de Glasgow',
      description: 'Avaliação do nível de consciência e reatividade pupilar (GCS-P).',
      path: '/glasgow',
      icon: Brain,
      tag: 'Neurologia',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    {
      title: 'Escore HACOR',
      description: 'Predição de falha de Ventilação Não Invasiva (VNI).',
      path: '/hacor',
      icon: Calculator,
      tag: 'VNI / Respiratória',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      title: 'Gasometria Arterial',
      description: 'Análise áciod-básica e oxigenação fisiológica.',
      path: '/gasometria',
      icon: Stethoscope,
      tag: 'Gasometria / UTI',
      color: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    },
    {
      title: 'Sistema CIF',
      description: 'Classificação Internacional de Funcionalidade, Incapacidade e Saúde.',
      path: '/cif',
      icon: Layers,
      tag: 'Funcionalidade',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      title: 'Sistema CIAP-2',
      description: 'Classificação Internacional de Atenção Primária.',
      path: '/ciap2',
      icon: BookOpen,
      tag: 'Atenção Básica',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      title: 'FisioIA',
      description: 'Assistente Clínico de IA com respostas estruturadas e guardrails.',
      path: '/fisioia',
      icon: ShieldCheck,
      tag: 'IA Clínica',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Banner de Boas-vindas */}
      <section className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
            Produção &amp; Confiabilidade Clínica
          </div>
          <h1 className="text-2xl lg:text-4xl font-extrabold font-display tracking-tight text-white">
            Plataforma Clínica FisioElite
          </h1>
          <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
            Ferramentas avançadas de suporte à decisão clínica em Fisioterapia Intensiva, Respiratória e Neurofuncional. Arquitetura estrita, validação determinística e conformidade WCAG 2.2 AA.
          </p>
        </div>
      </section>

      {/* Grid de Módulos */}
      <section aria-labelledby="modules-heading" className="space-y-4">
        <h2 id="modules-heading" className="text-xl font-bold font-display text-white">
          Ferramentas &amp; Calculadoras Clínicas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.path}
                to={m.path}
                className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all flex flex-col justify-between space-y-4 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-lg border ${m.color}`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>
                </div>
                <div className="text-xs font-semibold text-teal-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Acessar Ferramenta &rarr;
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
