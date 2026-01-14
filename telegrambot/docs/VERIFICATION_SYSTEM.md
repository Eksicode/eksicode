# Human Verification System

## Overview

The human verification system automatically requires new group members to prove they are human by clicking a verification button. This helps prevent bot spam and ensures only legitimate users can participate in group discussions.

## How It Works

### 1. **Automatic Trigger**
- When a new user joins a group, the system automatically detects them
- Bots are automatically skipped (no verification required)
- Human users are immediately restricted from sending messages

### 2. **Verification Process**
- A welcome message is sent with a verification button
- User has **5 minutes** to click the button
- If they don't verify within the time limit, they are automatically kicked
- Once verified, all restrictions are removed

### 3. **User Experience**
```
👋 Hoş geldin [User Name]!

🤖 Bu grupta spam ve bot koruması için doğrulama gereklidir.

✅ Aşağıdaki butona tıklayarak insan olduğunuzu doğrulayın:

⏰ Süre: 5 dakika
❌ Süre dolduğunda otomatik olarak gruptan çıkarılacaksınız.

[✅ İnsan Olduğumu Doğrula]
```

## Admin Commands

### `/verify stats`
Shows verification statistics:
- Total pending verifications
- Pending verifications in current chat
- System configuration

### `/verify pending`
Lists all pending verifications in the current chat:
- User names and IDs
- Time remaining for each verification

### `/verify force <user_id>`
Manually verifies a user (bypasses the verification process):
```
/verify force 123456789
```

### `/verify help`
Shows help information for verification commands.

## Configuration

The verification system can be configured in `src/config/verification.js`:

```javascript
module.exports = {
  // Verification timeout (5 minutes)
  verificationTimeout: 300000,
  
  // Cleanup interval (1 minute)
  cleanupInterval: 60000,
  
  // Rate limiting
  rateLimit: {
    verify: { requests: 5, window: 60000 },
    force: { requests: 3, window: 300000 }
  },
  
  // Requirements
  requirements: {
    skipForUsers: [],      // Trusted user IDs
    skipForChats: [],      // Trusted chat IDs
    minAccountAge: 0,      // Minimum account age (days)
    requireProfilePhoto: false
  }
}
```

## Security Features

### 1. **Rate Limiting**
- Prevents command spam
- Different limits for different commands
- Automatic cleanup of expired verifications

### 2. **Input Validation**
- Validates user IDs and chat IDs
- Checks for proper permissions
- Handles edge cases gracefully

### 3. **Error Handling**
- Comprehensive error logging
- Graceful failure handling
- User-friendly error messages

### 4. **Automatic Cleanup**
- Removes expired verifications
- Prevents memory leaks
- Maintains system performance

## Technical Details

### Files Structure
```
src/
├── utils/
│   └── verificationManager.js    # Core verification logic
├── commands/
│   └── verify.js                 # Admin commands
├── handlers/
│   ├── joinedLeftUserHandler.js  # Join/leave events
│   └── callbackHandler.js        # Button callbacks
└── config/
    └── verification.js           # Configuration
```

### Database Integration
Currently uses in-memory storage. For production, consider:
- Redis for distributed systems
- PostgreSQL for persistent storage
- MongoDB for flexible schemas

### Performance Considerations
- Memory usage scales with active verifications
- Automatic cleanup prevents memory leaks
- Rate limiting prevents abuse
- Efficient data structures for lookups

## Troubleshooting

### Common Issues

1. **User not getting verification message**
   - Check bot permissions in the group
   - Ensure bot can send messages and restrict users
   - Check for rate limiting

2. **Verification button not working**
   - Check callback handler registration
   - Verify button callback data format
   - Check for permission errors

3. **Users not being kicked after timeout**
   - Check bot admin permissions
   - Verify timeout handling
   - Check for API rate limits

### Debug Commands
```bash
# Check verification stats
/verify stats

# List pending verifications
/verify pending

# Force verify a user
/verify force <user_id>
```

## Future Enhancements

### Planned Features
1. **Database Integration** - Persistent storage
2. **Advanced Filtering** - Account age, profile photo requirements
3. **Custom Messages** - Per-group verification messages
4. **Analytics** - Detailed verification statistics
5. **Whitelist Management** - Trusted users and chats

### Integration Ideas
1. **CAPTCHA Integration** - Additional verification steps
2. **Social Media Verification** - Link social accounts
3. **Phone Number Verification** - SMS verification
4. **Email Verification** - Email confirmation

## Monitoring

### Logs
- All verification events are logged
- Error tracking and debugging
- Performance metrics
- User behavior analytics

### Metrics
- Verification success rate
- Average verification time
- Failed verification reasons
- System performance stats

## Best Practices

1. **Test Thoroughly** - Test with different user types
2. **Monitor Performance** - Watch for memory leaks
3. **Update Regularly** - Keep dependencies updated
4. **Backup Data** - Regular configuration backups
5. **Document Changes** - Keep documentation updated
