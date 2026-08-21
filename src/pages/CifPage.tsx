import React, { useState } from 'react';
import { Layers, Search, BookOpen } from 'lucide-react';
import { sanitizeHtml } from '@/shared/lib/security/sanitizer';

interface CifCategory {
  code: string;
  domain: string;
  name: string;
  description: string;
}

const CIF_DATA: CifCategory[] = [
  { code: 'b440', domain: 'Funções do Corpo', name: 'Funções Respiratórias', description: 'Funções de inalação de ar nos pulmões, trocas gasosas e expiração.' },
  { code: 'b445', domain: 'Funções do Corpo', name: 'Funções dos Músculos Respiratórios', description: 'Funções dos músculos envolvidos na respiração (diafragma, intercostais).' },
  { code: 'b455', domain: 'Funções do Corpo', name: 'Funções de Tolerância ao Exercício', description: 'Funções relacionadas com a capacidade de suporte e resistência em esforço físico.' },
  { code: 'b730', domain: 'Funções do Corpo', name: 'Funções de Força Muscular', description: 'Funções relacionadas com a força gerada pela contração de um músculo ou grupo muscular.' },
  { code: 'd450', domain: 'Atividades e Participação', name: 'Andar / Marcha', description: 'Mover-se sobre uma superfície a pé, passo a passo, de modo a avançar.' },
  { code: 'd410', domain: 'Atividades e Participação', name: 'Mudar Posições Básicas do Corpo', description: 'Ficar de pé, sentar-se, deitar-se ou ajoelhar-se.' },
  { code: 'e115', domain: 'Fatores Ambientais', name: 'Produtos e Tecnologias para Mobilidade', description: 'Equipamentos e tecnologias assistivas para locomoção e transporte.' },
];

export const CifPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = CIF_DATA.filter((item) => {
    const cleanTerm = sanitizeHtml(searchTerm).toLowerCase();
    return (
      item.code.toLowerCase().includes(cleanTerm) ||
      item.name.toLowerCase().includes(cleanTerm) ||
      item.description.toLowerCase().includes(cleanTerm)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <Layers className="w-4 h-4" aria-hidden="true" />
          Sistema CIF — Organização Mundial da Saúde (OMS)
        </div>
        <h1 className="text-2xl font-bold font-display text-white">
          Classificação Internacional de Funcionalidade, Incapacidade e Saúde
        </h1>
        <p className="text-xs text-slate-400">
          Consulte códigos e categorias biopsicossociais para codificação funcional do paciente.
        </p>
      </div>

      {/* Campo de Busca Sanitizado */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por código (ex: b440), nome ou descrição..."
          aria-label="Buscar código CIF"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-slate-500"
        />
      </div>

      {/* Lista de Códigos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((item) => (
          <div key={item.code} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-lg text-emerald-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                {item.code}
              </span>
              <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {item.domain}
              </span>
            </div>
            <h2 className="text-base font-bold text-white">{item.name}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm">
            Nenhum código CIF encontrado para a busca especificada.
          </div>
        )}
      </div>
    </div>
  );
};
