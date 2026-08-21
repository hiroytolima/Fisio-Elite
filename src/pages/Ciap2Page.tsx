import React, { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { sanitizeHtml } from '@/shared/lib/security/sanitizer';

interface CiapCategory {
  code: string;
  component: string;
  name: string;
  chapter: string;
}

const CIAP_DATA: CiapCategory[] = [
  { code: 'R02', component: 'Sintomas / Queixas', name: 'Falta de ar / Dispneia', chapter: 'Aparelho Respiratório' },
  { code: 'R05', component: 'Sintomas / Queixas', name: 'Tosse', chapter: 'Aparelho Respiratório' },
  { code: 'R81', component: 'Diagnóstico / Doença', name: 'Pneumonia', chapter: 'Aparelho Respiratório' },
  { code: 'R95', component: 'Diagnóstico / Doença', name: 'Doença Pulmonar Obstrutiva Crônica (DPOC)', chapter: 'Aparelho Respiratório' },
  { code: 'L02', component: 'Sintomas / Queixas', name: 'Sintomas/queixas do joelho', chapter: 'Aparelho Músculo-esquelético' },
  { code: 'L03', component: 'Sintomas / Queixas', name: 'Sintomas/queixas lombares', chapter: 'Aparelho Músculo-esquelético' },
  { code: 'L83', component: 'Diagnóstico / Doença', name: 'Síndrome do Túnel do Carpo', chapter: 'Aparelho Músculo-esquelético' },
  { code: 'N01', component: 'Sintomas / Queixas', name: 'Cefaleia', chapter: 'Sistema Nervoso' },
  { code: 'K86', component: 'Diagnóstico / Doença', name: 'Hipertensão Sem Complicações', chapter: 'Aparelho Circulatório' },
];

export const Ciap2Page: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = CIAP_DATA.filter((item) => {
    const cleanTerm = sanitizeHtml(searchTerm).toLowerCase();
    return (
      item.code.toLowerCase().includes(cleanTerm) ||
      item.name.toLowerCase().includes(cleanTerm) ||
      item.chapter.toLowerCase().includes(cleanTerm)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          Sistema CIAP-2 — Atenção Primária à Saúde
        </div>
        <h1 className="text-2xl font-bold font-display text-white">
          Classificação Internacional de Atenção Primária (CIAP-2)
        </h1>
        <p className="text-xs text-slate-400">
          Pesquise episódios de cuidado, problemas de saúde e diagnósticos na atenção básica.
        </p>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por código CIAP-2 (ex: R02), termo ou capítulo..."
          aria-label="Buscar código CIAP-2"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-amber-400 focus:outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((item) => (
          <div key={item.code} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-lg text-amber-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                {item.code}
              </span>
              <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {item.chapter}
              </span>
            </div>
            <h2 className="text-base font-bold text-white">{item.name}</h2>
            <p className="text-xs text-slate-400 font-medium">Componente: {item.component}</p>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm">
            Nenhum resultado encontrado na CIAP-2.
          </div>
        )}
      </div>
    </div>
  );
};
