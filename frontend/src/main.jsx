import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

// --- Emergency Global Error Boundary ---
class GlobalErrorGuard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CRITICAL: GlobalErrorGuard caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          fontFamily: 'system-ui, sans-serif', 
          maxWidth: '600px', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#ef4444', fontSize: '1.5rem', marginBottom: '1rem' }}>
            System Critical Error
          </h2>
          <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
            The application failed to initialize. This is likely a core configuration or dependency issue.
          </p>
          <div style={{ 
            background: '#f1f5f9', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            overflowX: 'auto',
            textAlign: 'left',
            marginBottom: '1.5rem',
            border: '1px solid #cbd5e1'
          }}>
            <code style={{ color: '#b91c1c', fontSize: '0.875rem' }}>
              {this.state.error?.toString()}
            </code>
          </div>
          <button 
            onClick={() => {
              localStorage.clear(); 
              window.location.reload();
            }}
            style={{
              background: '#0f172a',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear Cache & Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorGuard>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </GlobalErrorGuard>
  </React.StrictMode>,
);