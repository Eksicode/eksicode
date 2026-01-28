/**
 * Verification system configuration
 */

interface RateLimitConfig {
  requests: number;
  window: number;
}

interface VerificationMessages {
  welcome: (name: string) => string;
  success: (name: string) => string;
  timeout: string;
  buttonText: string;
  buttonCallback: (userId: number) => string;
}

interface VerificationRequirements {
  skipForUsers: number[];
  skipForChats: number[];
  minAccountAge: number;
  requireProfilePhoto: boolean;
}

interface CleanupSettings {
  autoCleanup: boolean;
  interval: number;
}

export interface VerificationConfig {
  verificationTimeout: number;
  cleanupInterval: number;
  rateLimit: {
    verify: RateLimitConfig;
    force: RateLimitConfig;
  };
  messages: VerificationMessages;
  requirements: VerificationRequirements;
  cleanup: CleanupSettings;
}

const verificationConfig: VerificationConfig = {
  // Verification timeout in milliseconds (5 minutes)
  verificationTimeout: 300000,

  // Cleanup interval in milliseconds (1 minute)
  cleanupInterval: 60000,

  // Rate limiting for verification commands
  rateLimit: {
    verify: { requests: 5, window: 60000 }, // 5 requests per minute
    force: { requests: 3, window: 300000 }  // 3 requests per 5 minutes
  },

  // Messages
  messages: {
    welcome: (name: string) => `👋 **Hoş geldin ${name}!**\n\n` +
      `🤖 Bu grupta spam ve bot koruması için doğrulama gereklidir.\n\n` +
      `✅ Aşağıdaki butona tıklayarak insan olduğunuzu doğrulayın:\n\n` +
      `⏰ **Süre:** 5 dakika\n` +
      `❌ Süre dolduğunda otomatik olarak gruptan çıkarılacaksınız.`,

    success: (name: string) => `✅ **Doğrulama Başarılı!**\n\n` +
      `Hoş geldin ${name}! ` +
      `Artık grupta mesaj gönderebilirsin.`,

    timeout: `⏰ **Doğrulama Süresi Doldu**\n\n` +
      `Kullanıcı 5 dakika içinde doğrulama yapmadığı için gruptan çıkarıldı.`,

    buttonText: '✅ İnsan Olduğumu Doğrula',
    buttonCallback: (userId: number) => `verify:${userId}`
  },

  // Verification requirements
  requirements: {
    // Skip verification for these user IDs (trusted users)
    skipForUsers: [],

    // Skip verification for these chat IDs (trusted chats)
    skipForChats: [],

    // Minimum account age in days (0 = disabled)
    minAccountAge: 0,

    // Require profile photo
    requireProfilePhoto: false
  },

  // Auto-cleanup settings
  cleanup: {
    // Auto-cleanup expired verifications
    autoCleanup: true,

    // Cleanup interval
    interval: 60000
  }
};

export default verificationConfig;
