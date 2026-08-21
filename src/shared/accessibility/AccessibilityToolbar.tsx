import React from 'react';
import { Eye, Type, Zap, Sun, Moon, Contrast } from 'lucide-react';
import { useThemeStore } from '@/features/theme/store/useThemeStore';

export const AccessibilityToolbar: React.FC = () => {
  const { theme, setTheme, fontSizeScale, setFontSizeScale, reducedMotion, toggleReducedMotion } =
    useThemeStore();

  return (
    <div
      role="region"
      aria-label="Ferramentas de Acessibilidade"
      className="bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:px-3 focus:py-1.5 focus:bg-teal-600 focus:text-white focus:rounded focus:font-semibold focus:outline-none"
      >
        Pular para conteúdo principal (Skip Link)
      </a>

      <div className="flex items-center gap-4">
        <span className="font-semibold text-slate-400 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          Acessibilidade:
        </span>

        {/* Modos de Tema */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
          <button
            onClick={() => setTheme('dark')}
            aria-pressed={theme === 'dark'}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
              theme === 'dark' ? 'bg-teal-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Moon className="w-3 h-3" aria-hidden="true" />
            Escuro
          </button>
          <button
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
              theme === 'light' ? 'bg-teal-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Sun className="w-3 h-3" aria-hidden="true" />
            Claro
          </button>
          <button
            onClick={() => setTheme('high-contrast')}
            aria-pressed={theme === 'high-contrast'}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
              theme === 'high-contrast' ? 'bg-amber-400 text-black font-bold' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Contrast className="w-3 h-3" aria-hidden="true" />
            Alto Contraste
          </button>
        </div>

        {/* Ajuste de Fonte */}
        <div className="flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span className="text-slate-400">Fonte:</span>
          <button
            onClick={() => setFontSizeScale(1)}
            aria-label="Tamanho de fonte padrão"
            className={`px-2 py-0.5 rounded border text-xs ${
              fontSizeScale === 1 ? 'bg-slate-800 border-teal-500 text-teal-400 font-bold' : 'border-slate-800 text-slate-400'
            }`}
          >
            100%
          </button>
          <button
            onClick={() => setFontSizeScale(1.25)}
            aria-label="Aumentar fonte para 125%"
            className={`px-2 py-0.5 rounded border text-xs ${
              fontSizeScale === 1.25 ? 'bg-slate-800 border-teal-500 text-teal-400 font-bold' : 'border-slate-800 text-slate-400'
            }`}
          >
            125%
          </button>
        </div>

        {/* Reduced Motion */}
        <button
          onClick={toggleReducedMotion}
          aria-pressed={reducedMotion}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300"
        >
          <Zap className="w-3 h-3 text-teal-400" aria-hidden="true" />
          Animações: <span className="font-semibold text-teal-400">{reducedMotion ? 'Reduzidas' : 'Normais'}</span>
        </button>
      </div>
    </div>
  );
};
