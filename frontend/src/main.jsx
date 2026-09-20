import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Rydeon App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7FAFE] text-[#101D3A] p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center font-bold text-xl">⚠️</div>
            <h2 className="text-xl font-bold text-[#101D3A]">Something went wrong</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              An unexpected error occurred while rendering Rydeon.
            </p>
            <div className="bg-[#F7FAFE] p-3 rounded-xl text-left text-xs font-mono text-rose-600 overflow-x-auto max-h-32 border border-[#DCE5F0]">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#1683F8] hover:bg-[#168BFF] text-white font-bold py-2.5 rounded-xl transition text-sm shadow-lg shadow-[#1683F8]/20"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)

