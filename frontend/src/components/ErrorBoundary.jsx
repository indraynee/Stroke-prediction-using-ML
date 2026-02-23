import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, send to error tracking service like Sentry)
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030616] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-[#0f1432] rounded-lg p-8 border border-[#1a1f47] text-center">
            <div className="inline-block p-4 bg-red-500/10 rounded-full mb-4">
              <AlertTriangle className="text-red-500" size={48} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
            
            <p className="text-gray-400 mb-6">
              We're sorry for the inconvenience. An unexpected error occurred.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-[#1a1f47] rounded-lg p-4 mb-6 text-left">
                <p className="text-red-400 text-sm font-mono mb-2">
                  {this.state.error.toString()}
                </p>
                <details className="text-gray-400 text-xs font-mono">
                  <summary className="cursor-pointer hover:text-white">
                    Stack trace
                  </summary>
                  <pre className="mt-2 overflow-auto max-h-40">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-[#8ebae2] text-[#030616] px-6 py-3 rounded-lg font-medium hover:bg-[#a5c9eb] transition"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
