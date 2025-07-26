import { useState, useCallback } from 'react';
import authService from '@/services/authService';

export type AuthErrorType = 
  | 'email_verification'
  | 'invalid_credentials'
  | 'network_error'
  | 'server_error'
  | 'validation_error'
  | 'unknown';

export interface AuthError {
  type: AuthErrorType;
  message: string;
  showResendLink?: boolean;
  showRegistrationLink?: boolean;
  showForgotPasswordLink?: boolean;
}

export function useAuthError() {
  const [error, setError] = useState<AuthError | null>(null);

  const handleError = useCallback((errorMessage: string, originalError?: any): AuthError => {
    const errorType = authService.categorizeError(errorMessage);
    const message = authService.getErrorMessage(errorType, errorMessage);
    
    const authError: AuthError = {
      type: errorType,
      message,
      showResendLink: errorType === 'email_verification',
      showRegistrationLink: errorType === 'invalid_credentials',
      showForgotPasswordLink: errorType === 'invalid_credentials',
    };

    setError(authError);
    return authError;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((apiResponse: any): AuthError => {
    if (apiResponse.errors && apiResponse.errors.length > 0) {
      // Handle validation errors
      const firstError = apiResponse.errors[0];
      return handleError(firstError.message, 'validation_error');
    }
    
    return handleError(apiResponse.message || 'Beklenmeyen bir hata oluştu');
  }, [handleError]);

  const handleNetworkError = useCallback((error: any): AuthError => {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return handleError('Ağ bağlantısı hatası oluştu', 'network_error');
    }
    
    return handleError('Beklenmeyen bir hata oluştu', 'unknown');
  }, [handleError]);

  return {
    error,
    handleError,
    handleApiError,
    handleNetworkError,
    clearError,
  };
} 