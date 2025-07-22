/**
 * Simple in-memory token blacklist service
 * In production, you might want to use Redis or database storage
 */
class TokenBlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  /**
   * Add a token to the blacklist
   */
  public blacklistToken(token: string): void {
    this.blacklistedTokens.add(token);
  }

  /**
   * Check if a token is blacklisted
   */
  public isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  /**
   * Clean up expired tokens (optional cleanup method)
   * In a real implementation, you'd want to run this periodically
   */
  public cleanup(): void {
    // For JWT tokens, you could decode and check expiry
    // For simplicity, we'll keep all tokens until server restart
    // In production, implement proper cleanup based on token expiry
  }

  /**
   * Get the count of blacklisted tokens (for monitoring)
   */
  public getBlacklistSize(): number {
    return this.blacklistedTokens.size;
  }
}

// Export singleton instance
export default new TokenBlacklistService();
