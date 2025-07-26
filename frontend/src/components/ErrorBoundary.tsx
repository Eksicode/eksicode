'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { MdError, MdRefresh } from 'react-icons/md';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-red-500 mb-4">
            <MdError className="text-4xl mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Bir hata oluştu
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
            Beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
          </p>
          {this.state.error && (
            <details className="mb-4 text-left max-w-md">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                Hata detayları
              </summary>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button
            onClick={this.handleRetry}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <MdRefresh className="text-lg" />
            <span>Tekrar Dene</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 