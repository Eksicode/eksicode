/**
 * Rate limiting utilities for commands
 */

class RateLimiter {
  private requests: Map<string, number[]>;
  private defaultLimit: number;
  private defaultWindow: number;

  constructor() {
    this.requests = new Map();
    this.defaultLimit = 5; // requests per minute
    this.defaultWindow = 60000; // 1 minute in milliseconds
  }

  /**
   * Check if user has exceeded rate limit
   */
  isLimited(userId: number, command: string = 'default', limit: number = this.defaultLimit, window: number = this.defaultWindow): boolean {
    const key = `${userId}_${command}`;
    const now = Date.now();
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const userRequests = this.requests.get(key)!;
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => now - timestamp < window);
    this.requests.set(key, validRequests);
    
    // Check if limit exceeded
    if (validRequests.length >= limit) {
      return true;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return false;
  }

  /**
   * Get remaining requests for user
   */
  getRemainingRequests(userId: number, command: string = 'default', limit: number = this.defaultLimit, window: number = this.defaultWindow): number {
    const key = `${userId}_${command}`;
    const now = Date.now();
    
    if (!this.requests.has(key)) {
      return limit;
    }
    
    const userRequests = this.requests.get(key)!;
    const validRequests = userRequests.filter(timestamp => now - timestamp < window);
    
    return Math.max(0, limit - validRequests.length);
  }

  /**
   * Clear rate limit for user
   */
  clearLimit(userId: number, command: string = 'default'): void {
    const key = `${userId}_${command}`;
    this.requests.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.requests.clear();
  }
}

export default new RateLimiter();
export { RateLimiter };
