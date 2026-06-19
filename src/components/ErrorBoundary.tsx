import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          className="flex flex-col items-center justify-center p-8 rounded-3xl bg-red-500/5 border border-red-500/20 glass-card min-h-[300px] text-center space-y-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {this.props.fallbackMessage || 
                (this.state.error?.message ? this.state.error.message : 'An unexpected error occurred while rendering this section.')
              }
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-white rounded-xl border border-slate-200 dark:border-white/5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none transition-all"
            aria-label="Refresh application state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
