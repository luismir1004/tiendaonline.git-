import React, { Component } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="text-center max-w-md">
            <div className="bg-red-50 text-red-500 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Algo salió mal</h1>
            <p className="text-slate-500 mb-8">
              Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
            </p>
            <button
              onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
              }}
              className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 mx-auto shadow-lg shadow-slate-900/20"
            >
              <RefreshCw size={18} /> Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;