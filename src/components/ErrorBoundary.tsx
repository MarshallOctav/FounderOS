import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 max-w-2xl mx-auto my-12 bg-white rounded-xl border border-rose-200 shadow-sm">
          <div className="flex items-center gap-3 text-rose-600 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            <h2 className="text-xl font-bold">Terjadi Kesalahan Tampilan (UI Error)</h2>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            FounderOS mendeteksi adanya error ketika merender layar ini. Silakan muat ulang halaman atau periksa pesan kesalahan di bawah.
          </p>
          <div className="bg-slate-900 text-rose-400 p-4 rounded-lg font-mono text-xs overflow-auto max-h-60 mb-6">
            {this.state.error?.toString()}
          </div>
          <button
            onClick={this.handleReload}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors"
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
