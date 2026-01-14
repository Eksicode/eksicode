/**
 * Verification system configuration
 */

module.exports = {
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
    welcome: (name) => `👋 **Hoş geldin ${name}!**\n\n` +
      `🤖 Bu grupta spam ve bot koruması için doğrulama gereklidir.\n\n` +
      `✅ Aşağıdaki butona tıklayarak insan olduğunuzu doğrulayın:\n\n` +
      `⏰ **Süre:** 5 dakika\n` +
      `❌ Süre dolduğunda otomatik olarak gruptan çıkarılacaksınız.`,
    
    success: (name) => `✅ **Doğrulama Başarılı!**\n\n` +
      `Hoş geldin ${name}! ` +
      `Artık grupta mesaj gönderebilirsin.`,
    
    timeout: `⏰ **Doğrulama Süresi Doldu**\n\n` +
      `Kullanıcı 5 dakika içinde doğrulama yapmadığı için gruptan çıkarıldı.`,
    
    buttonText: '✅ İnsan Olduğumu Doğrula',
    buttonCallback: (userId) => `verify:${userId}`
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
}
