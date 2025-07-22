/**
 * Logger utility for seeding operations
 * Provides consistent logging with colors and timestamps
 */
export class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  info(message: string, ...args: any[]): void {
    console.log(`[${this.formatTimestamp()}] ℹ️  ${message}`, ...args);
  }

  success(message: string, ...args: any[]): void {
    console.log(`[${this.formatTimestamp()}] ✅ ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[${this.formatTimestamp()}] ⚠️  ${message}`, ...args);
  }

  error(message: string, error?: any): void {
    console.error(`[${this.formatTimestamp()}] ❌ ${message}`);
    if (error) {
      console.error('Error details:', error);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${this.formatTimestamp()}] 🐛 ${message}`, ...args);
    }
  }
}
