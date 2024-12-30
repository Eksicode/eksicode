import { config } from 'dotenv';
config({ path: `.env` });

export const cookieExpriresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
export const tokenExpiresIn = 7 * 24 * 60 * 60; // 7 days in seconds

export const { 
  NODE_ENV,
  PORT,
  DATABASE_URL,
  SECRET_KEY,
  AUTHENTICATION_CODE_SECRET_KEY,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_SES_REGION,
  AWS_SES_MAIL_SOURCE,
  AWS_S3_REGION,
  ALLOWED_ORIGINS,
  ALLOWED_REDIRECT_URLS,
  GMAIL_EMAIL_ADDRESS,
  GMAIL_EMAIL_PASSWORD
} = process.env;