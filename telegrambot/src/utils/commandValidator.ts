/**
 * Command validation utilities
 */

import errorMessage from './errorMessage';

interface Context {
  chat: { type: string };
}

class CommandValidator {
  /**
   * Validates if required environment variables are set
   */
  static validateEnvironment(): void {
    const requiredEnvVars = [
      'BOT_TOKEN',
      'API_URL',
      'API_USER',
      'API_PASS',
      'ADMIN_CH_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  /**
   * Validates command arguments
   */
  static validateArgs(args: any[], minLength: number = 0, maxLength: number = Infinity): boolean {
    if (args.length < minLength) {
      throw new Error(`Minimum ${minLength} arguments required`);
    }
    if (args.length > maxLength) {
      throw new Error(`Maximum ${maxLength} arguments allowed`);
    }
    return true;
  }

  /**
   * Validates URL format
   */
  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      throw new Error('Invalid URL format');
    }
  }

  /**
   * Sanitizes user input
   */
  static sanitizeInput(input: any): any {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Validates chat type
   */
  static validateChatType(ctx: Context, allowedTypes: string[] = ['group', 'supergroup', 'private']): boolean {
    if (!allowedTypes.includes(ctx.chat.type)) {
      throw new Error('Command not allowed in this chat type');
    }
    return true;
  }
}

export default CommandValidator;
export { CommandValidator };

// CommonJS compatibility for direct requires from JS files
module.exports = CommandValidator;
module.exports.CommandValidator = CommandValidator;
