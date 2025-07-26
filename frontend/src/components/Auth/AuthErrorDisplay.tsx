import React from 'react';
import Link from 'next/link';
import { AuthError } from '@/hooks/useAuthError';

interface AuthErrorDisplayProps {
  error: AuthError;
  onClose?: () => void;
}

const AuthErrorDisplay: React.FC<AuthErrorDisplayProps> = ({ error, onClose }) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'email_verification':
        return (
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getErrorStyles = () => {
    switch (error.type) {
      case 'email_verification':
        return "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300";
      default:
        return "bg-red-50 border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300";
    }
  };

  return (
    <div className={`mb-4 p-4 rounded-lg border-l-4 ${getErrorStyles()}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getErrorIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{error.message}</p>
          
          {/* Action Links */}
          <div className="mt-2 space-y-1">
            {error.showResendLink && (
              <Link 
                href="/auth/resend-verification" 
                className="text-sm font-medium underline hover:no-underline transition-colors block"
              >
                Doğrulama e-postası gönder
              </Link>
            )}
            
            {error.showRegistrationLink && (
              <Link 
                href="/auth/uye-ol" 
                className="text-sm font-medium underline hover:no-underline transition-colors block"
              >
                Hesap oluştur
              </Link>
            )}
            
            {error.showForgotPasswordLink && (
              <Link 
                href="/auth/sifremi-unuttum" 
                className="text-sm font-medium underline hover:no-underline transition-colors block"
              >
                Şifremi unuttum
              </Link>
            )}
          </div>
        </div>
        
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Hata mesajını kapat"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthErrorDisplay; 