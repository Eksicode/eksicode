# Prisma to Vanilla SQL Refactoring Summary

## Overview
This document summarizes the refactoring of the telegrambot project from Prisma ORM to vanilla SQL using the `pg` (PostgreSQL) library.

## Changes Made

### 1. Database Connection
- **Removed**: `src/utils/prisma-client.ts` (Prisma client)
- **Added**: `src/utils/db-client.ts` (PostgreSQL connection pool using `pg`)
- Uses connection pooling with configurable limits
- Implements graceful shutdown handlers
- Provides helper functions: `query()`, `queryOne()`, `queryMany()`

### 2. Package Dependencies
**Removed:**
- `@prisma/client` (dependencies)
- `prisma` (devDependencies)
- `postinstall` script that ran `prisma generate`

**Added:**
- `pg` (dependencies)
- `@types/pg` (devDependencies)

### 3. Files Refactored

#### Verification Manager (`src/utils/verificationManager.ts`)
- Replaced all Prisma queries with raw SQL
- `TelegramVerification.findMany()` → `SELECT FROM telegram_verifications`
- `TelegramVerification.create()` → `INSERT INTO telegram_verifications`
- `TelegramVerification.delete()` → `DELETE FROM telegram_verifications`
- `TelegramVerification.deleteMany()` → `DELETE FROM telegram_verifications WHERE ...`

#### Command Files
- **ban.ts**: `TelegramGroup.findMany()` → `SELECT FROM telegram_groups`
- **unban.ts**: `TelegramGroup.findMany()` → `SELECT FROM telegram_groups`
- **pin.ts**: `TelegramGroup.findMany()` → `SELECT FROM telegram_groups`
- **group.ts**: `TelegramGroup.findMany()` with search → `SELECT FROM telegram_groups WHERE ... LIKE ...`
- **kontrol.ts**: 
  - `Source.findMany()` → `SELECT FROM sources`
  - `Source.updateMany()` → `UPDATE sources SET ...`
  - `Source.deleteMany()` → `DELETE FROM sources WHERE ...`
- **kaynak.ts**: `Source.create()` → `INSERT INTO sources`

### 4. Database Schema Mapping

#### Table: `telegram_verifications`
- `userId` (BigInt) → `user_id` (TEXT/VARCHAR, stored as string)
- `chatId` (BigInt) → `chat_id` (TEXT/VARCHAR, stored as string)
- `messageId` → `message_id` (INTEGER)
- `firstName` → `first_name` (VARCHAR)
- `lastName` → `last_name` (VARCHAR)
- `username` → `username` (VARCHAR)
- `createdAt` → `created_at` (TIMESTAMP)
- `expiresAt` → `expires_at` (TIMESTAMP)

#### Table: `telegram_groups`
- `channelId` → `channel_id` (VARCHAR)
- `name` → `name` (VARCHAR)
- `link` → `link` (VARCHAR)
- `active` → `active` (BOOLEAN)

#### Table: `sources`
- `id` → `id` (INTEGER)
- `title` → `title` (VARCHAR)
- `url` → `url` (VARCHAR)
- `tgChannel` → `tg_channel` (VARCHAR)
- `tgUser` → `tg_user` (VARCHAR)
- `approved` → `approved` (BOOLEAN)
- `active` → `active` (BOOLEAN)
- `createdAt` → `created_at` (TIMESTAMP)

### 5. Docker Configuration
**Updated**: `Dockerfile`
- Removed Prisma schema copy
- Removed `npx prisma generate` command
- Removed Prisma client copy steps

### 6. Environment Configuration
**Updated**: `sample.env`
- Added `DATABASE_URL` configuration section
- Includes example connection strings for production and development

## Key Implementation Details

### BigInt Handling
PostgreSQL `BIGINT` values are handled by converting to/from strings:
- When storing: `userId.toString()` or `BigInt(userId).toString()`
- When reading: `Number(verification.user_id)`

### Query Helpers
The new `db-client.ts` provides three helper functions:
- `query<T>()`: Execute any SQL query, returns full `QueryResult<T>`
- `queryOne<T>()`: Execute query expecting single row, returns `T | null`
- `queryMany<T>()`: Execute query expecting multiple rows, returns `T[]`

### Error Handling
- All database errors are logged to console
- Queries use parameterized statements to prevent SQL injection
- Graceful error handling with try-catch blocks maintained

### Connection Pooling
- Maximum 20 connections in pool
- 30 second idle timeout
- 2 second connection timeout
- Singleton pattern for development (reuses connection across hot reloads)

## Migration Notes

### Before Running
1. Ensure `DATABASE_URL` is set in `.env` file
2. Run `npm install` to install `pg` and remove Prisma dependencies
3. Verify database tables exist (they should, as they're shared with backend)

### Testing Checklist
- [ ] Verification system works (new user joins group)
- [ ] Ban command works (bans user from all groups)
- [ ] Unban command works (unbans user from all groups)
- [ ] Pin command works (pins message to all groups)
- [ ] Group command works (lists/search groups)
- [ ] Kontrol command works (lists/approves/deletes sources)
- [ ] Kaynak command works (adds new sources)

## Benefits of This Refactoring

1. **Reduced Dependencies**: Removed Prisma ORM, reducing bundle size
2. **Direct SQL Control**: Full control over SQL queries and optimization
3. **Simpler Build Process**: No Prisma client generation step
4. **Better Performance**: Direct SQL can be more performant for simple queries
5. **Easier Debugging**: SQL queries are visible and can be tested directly

## Potential Issues & Solutions

### Issue: BigInt Type Handling
**Solution**: Convert BigInt values to strings when storing, convert back to numbers when reading

### Issue: Column Name Mismatches
**Solution**: All column names follow PostgreSQL snake_case convention (matching Prisma's `@@map` directives)

### Issue: Missing Type Safety
**Solution**: TypeScript generics in query helpers provide type safety for results

## Files Changed Summary

### Created
- `src/utils/db-client.ts`

### Modified
- `src/utils/verificationManager.ts`
- `src/commands/ban.ts`
- `src/commands/unban.ts`
- `src/commands/pin.ts`
- `src/commands/group.ts`
- `src/commands/kontrol.ts`
- `src/commands/kaynak.ts`
- `package.json`
- `Dockerfile`
- `sample.env`

### Deleted
- `src/utils/prisma-client.ts`
- `prisma/schema.prisma`

## Next Steps

1. Test all commands thoroughly
2. Monitor database connection pool usage
3. Consider adding query logging in production (currently only in development)
4. Add database migration scripts if needed for future schema changes
5. Consider adding connection retry logic for production resilience
