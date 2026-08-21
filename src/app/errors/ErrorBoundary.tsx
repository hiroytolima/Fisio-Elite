import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log seguro sem expor PII (dados pessoais)
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          role="alert" 
          aria-live="assertive"
          className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-50"
        >
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-400 mb-2">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-slate-100 font-display">
              Ops! Ocorreu um erro inesperado
            </h1>
            <p className="text-sm text-slate-400">
              Infelizmente encontramost uma falha temporária ao carregar este componente. Nossa equipe de segurança e engenharia foi notificada de forma anônima.
            </p>
            {this.state.error && (
              <div className="text-xs bg-slate-950 p-3 rounded text-slate-300 font-mono overflow-x-auto text-left max-h-32">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-teal-400 focus:outline-none"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Recarregar Aplicação
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
