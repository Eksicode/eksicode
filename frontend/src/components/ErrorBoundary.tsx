'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { MdError, MdRefresh } from 'react-icons/md';
import { getUserFacingMessage } from '@/utils/errors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Override title shown in default fallback */
  title?: string;
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
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }
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

      const userMessage = this.state.error
        ? getUserFacingMessage(this.state.error)
        : 'Beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.';
      const title = this.props.title ?? 'Bir hata oluştu';

      return (
        <div
          className="flex flex-col items-center justify-center p-8 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-red-500 dark:text-red-400 mb-4" aria-hidden>
            <MdError className="text-4xl mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
            {userMessage}
          </p>
          {this.state.error && process.env.NODE_ENV === 'development' && (
            <details className="mb-4 text-left max-w-md">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                Hata detayları (geliştirici)
              </summary>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button
            type="button"
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-eksiCode text-white rounded hover:opacity-90 transition-opacity"
          >
            <MdRefresh className="text-lg" aria-hidden />
            <span>Tekrar dene</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
