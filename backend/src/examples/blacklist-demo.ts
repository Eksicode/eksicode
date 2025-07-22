// Example demonstrating token blacklist functionality

import tokenBlacklistService from '../services/tokenBlacklist.service';

// Example usage of the token blacklist service
console.log('=== Token Blacklist Demo ===');

// Initially empty blacklist
console.log('Initial blacklist size:', tokenBlacklistService.getBlacklistSize()); // 0

// Simulate some tokens
const token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example1';
const token2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example2';

// Check if tokens are blacklisted (should be false)
console.log('Token1 blacklisted?', tokenBlacklistService.isTokenBlacklisted(token1)); // false
console.log('Token2 blacklisted?', tokenBlacklistService.isTokenBlacklisted(token2)); // false

// Blacklist token1 (simulate logout)
tokenBlacklistService.blacklistToken(token1);
console.log('Blacklisted token1');

// Check status again
console.log('Token1 blacklisted?', tokenBlacklistService.isTokenBlacklisted(token1)); // true
console.log('Token2 blacklisted?', tokenBlacklistService.isTokenBlacklisted(token2)); // false
console.log('Blacklist size:', tokenBlacklistService.getBlacklistSize()); // 1

// Blacklist token2
tokenBlacklistService.blacklistToken(token2);
console.log('Blacklisted token2');

// Final status
console.log('Token1 blacklisted?', tokenBlacklistService.isTokenBlacklisted(token1)); // true
console.log('Token2 blacklisted?', tokenBlacklistService.isTokenBlacklisted(token2)); // true
console.log('Final blacklist size:', tokenBlacklistService.getBlacklistSize()); // 2

console.log('=== Demo Complete ===');
