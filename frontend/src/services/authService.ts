import { 
  AuthApiResponse, 
  User, 
  LoginResponse, 
  RegisterResponse,
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResendVerificationFormData,
  ResetPasswordFormData,
  ProfileUpdateFormData,
  ChangePasswordFormData,
  ValidationError
} from '@/types/auth.zod';

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  private async handleResponse<T>(response: Response): Promise<AuthApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || `HTTP error! status: ${response.status}`,
          errors: data.errors || []
        };
      }

      return {
        success: true,
        message: data.message,
        data: data.data || data
      };
    } catch (error) {
      console.error("Response parsing error:", error);
      return {
        success: false,
        message: "Sunucu yanıtı işlenirken hata oluştu",
        errors: []
      };
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<AuthApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
        ...options,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("Request error:", error);
      return {
        success: false,
        message: "Ağ bağlantısı hatası oluştu",
        errors: []
      };
    }
  }

  private async makeAuthenticatedRequest<T>(
    endpoint: string, 
    token: string,
    options: RequestInit = {}
  ): Promise<AuthApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  }

  // Authentication methods
  async login(credentials: LoginFormData): Promise<AuthApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        userInfo: credentials.userInfo,
        password: credentials.password,
      }),
    });
  }

  async register(userData: RegisterFormData): Promise<AuthApiResponse<RegisterResponse>> {
    return this.makeRequest<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }),
    });
  }

  async logout(token: string): Promise<AuthApiResponse<void>> {
    return this.makeAuthenticatedRequest<void>("/auth/logout", token, {
      method: "POST",
    });
  }

  async getCurrentUser(token: string): Promise<AuthApiResponse<User>> {
    return this.makeAuthenticatedRequest<User>("/auth/me", token);
  }

  async verifyEmail(token: string): Promise<AuthApiResponse<void>> {
    return this.makeRequest<void>(`/auth/verify-email/${token}`, {
      method: "GET",
    });
  }

  async resendVerification(data: ResendVerificationFormData): Promise<AuthApiResponse<void>> {
    return this.makeRequest<void>("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(data: ForgotPasswordFormData): Promise<AuthApiResponse<void>> {
    return this.makeRequest<void>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordFormData): Promise<AuthApiResponse<void>> {
    return this.makeRequest<void>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProfile(token: string, data: ProfileUpdateFormData): Promise<AuthApiResponse<User>> {
    return this.makeAuthenticatedRequest<User>("/auth/profile", token, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(token: string, data: ChangePasswordFormData): Promise<AuthApiResponse<void>> {
    return this.makeAuthenticatedRequest<void>("/auth/change-password", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Utility methods
  async refreshToken(token: string): Promise<AuthApiResponse<{ token: string }>> {
    return this.makeAuthenticatedRequest<{ token: string }>("/auth/refresh", token, {
      method: "POST",
    });
  }

  async checkEmailAvailability(email: string): Promise<AuthApiResponse<{ available: boolean }>> {
    return this.makeRequest<{ available: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`, {
      method: "GET",
    });
  }

  async checkUsernameAvailability(username: string): Promise<AuthApiResponse<{ available: boolean }>> {
    return this.makeRequest<{ available: boolean }>(`/auth/check-username?username=${encodeURIComponent(username)}`, {
      method: "GET",
    });
  }

  // Error categorization
  categorizeError(errorMessage: string): 'email_verification' | 'invalid_credentials' | 'network_error' | 'server_error' | 'validation_error' | 'unknown' {
    const lowerMessage = errorMessage.toLowerCase();
    
    if (lowerMessage.includes("verify") || lowerMessage.includes("verification") || lowerMessage.includes("email")) {
      return "email_verification";
    }
    
    if (lowerMessage.includes("invalid_credentials") || lowerMessage.includes("user not found") || lowerMessage.includes("no user found")) {
      return "invalid_credentials";
    }
    
    if (lowerMessage.includes("network") || lowerMessage.includes("connection") || lowerMessage.includes("fetch")) {
      return "network_error";
    }
    
    if (lowerMessage.includes("server") || lowerMessage.includes("500") || lowerMessage.includes("internal")) {
      return "server_error";
    }
    
    if (lowerMessage.includes("validation") || lowerMessage.includes("invalid")) {
      return "validation_error";
    }
    
    return "unknown";
  }

  // Get user-friendly error message
  getErrorMessage(errorType: string, originalMessage?: string): string {
    switch (errorType) {
      case "email_verification":
        return "E-posta adresiniz henüz doğrulanmamış. Giriş yapabilmek için önce e-posta adresinizi doğrulamanız gerekiyor.";
      case "invalid_credentials":
        if (originalMessage?.toLowerCase().includes("user not found")) {
          return "Bu e-posta adresi veya kullanıcı adı ile kayıtlı bir hesap bulunamadı.";
        }
        return "E-posta adresi/kullanıcı adı veya şifre hatalı.";
      case "network_error":
        return "Bağlantı hatası oluştu. İnternet bağlantınızı kontrol edip tekrar deneyiniz.";
      case "server_error":
        return "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyiniz.";
      case "validation_error":
        return originalMessage || "Girilen bilgiler geçersiz.";
      case "unknown":
      default:
        return originalMessage || "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyiniz.";
    }
  }
}

const authService = new AuthService();
export default authService;
