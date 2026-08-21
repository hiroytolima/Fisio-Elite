import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import {
  Activity,
  Calculator,
  Brain,
  Layers,
  BookOpen,
  Menu,
  X,
  Search,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { AccessibilityToolbar } from '@/shared/accessibility/AccessibilityToolbar';

export const MainLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Início', path: '/', icon: Activity },
    { label: 'Escore SOFA', path: '/sofa', icon: Calculator },
    { label: 'Índice ROX', path: '/rox', icon: Calculator },
    { label: 'Escala de Glasgow', path: '/glasgow', icon: Brain },
    { label: 'Escore HACOR', path: '/hacor', icon: Calculator },
    { label: 'Gasometria Arterial', path: '/gasometria', icon: Calculator },
    { label: 'Sistema CIF', path: '/cif', icon: Layers },
    { label: 'Sistema CIAP-2', path: '/ciap2', icon: BookOpen },
    { label: 'FisioIA', path: '/fisioia', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Barra de Acessibilidade WCAG 2.2 AA */}
      <AccessibilityToolbar />

      {/* Header Principal */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Fisio<span className="text-teal-400">Elite</span>
            </span>
          </Link>
        </div>

        {/* Busca rápida */}
        <div className="hidden md:flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 w-72 text-sm text-slate-400 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
          <Search className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar calculadoras, CIF, CIAP..."
            aria-label="Buscar na plataforma"
            className="bg-transparent border-none outline-none w-full text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </header>

      {/* Container Principal com Sidebar e Área de Conteúdo */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 bg-slate-900/50 border-r border-slate-800 p-4 space-y-1 shrink-0">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Navegação Clínica
          </div>
          <nav aria-label="Menu principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-600/15 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Menu Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/95 p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="font-display font-bold text-lg text-white">Menu FisioElite</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
                aria-label="Fechar menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                      isActive ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Conteúdo da Página com id para SkipLink WCAG */}
        <main id="main-content" tabIndex={-1} className="flex-1 p-4 lg:p-8 overflow-y-auto outline-none">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-4 lg:px-8 py-4 text-xs text-slate-400 text-center flex flex-col md:flex-row items-center justify-between gap-2">
        <div>FisioElite © 2026 — Plataforma Clínica de Fisioterapia</div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Conformidade WCAG 2.2 AA</span>
          <span>•</span>
          <span>Segurança OWASP Top 10</span>
        </div>
      </footer>
    </div>
  );
};
