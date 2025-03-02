import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig({ path: path.join(process.cwd(), '.env') });

const config = {
  // Server settings
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // Authentication settings
  cookieExpiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  tokenExpiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  jwtSecret: process.env.JWT_SECRET || (() => {
    console.warn('WARNING: JWT_SECRET not set in environment variables');
    return 'default-jwt-secret-do-not-use-in-production';
  })(),
  authCodeSecret: process.env.AUTHENTICATION_CODE_SECRET_KEY,
  
  // Database settings
  databaseUrl: process.env.DATABASE_URL,
  
  // AWS settings
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    ses: {
      region: process.env.AWS_SES_REGION,
      mailSource: process.env.AWS_SES_MAIL_SOURCE,
    },
    s3: {
      region: process.env.AWS_S3_REGION,
    },
  },
  
  // Security settings
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
  allowedRedirectUrls: process.env.ALLOWED_REDIRECT_URLS?.split(',') || [],
  
  // Email settings
  email: {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
  },
  
  // Frontend settings
  frontendHost: process.env.FRONTEND_HOST,
  
  // Helper method to validate required configuration
  validate() {
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET is required');
    }
    const required = [
      'jwtSecret',
      'databaseUrl',
      'frontendHost'
    ];
    
    const missing = required.filter(key => !this[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }
  }
};

// Validate configuration on import
config.validate();

export default config;

