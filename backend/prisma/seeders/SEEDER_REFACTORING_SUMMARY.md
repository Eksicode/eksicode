# Seeder Refactoring Summary

This document summarizes the refactoring changes made to the seeders to accommodate the newly added model fields in the schema.

## Overview

The seeders have been updated to handle new fields added to various models in the schema, and new seeders have been created for models that were missing.

## Updated Seeders

### 1. UserSeeder (`seeders/user-seeder.ts`)
**New Fields Added:**
- `profilePictureId` - Reference to Media model (set to null initially)
- `birthday` - DateTime field (set to null)
- `telegramId` - Integer field (set to null)
- `phoneNumber` - String field (set to null)
- `linkedin` - String field (set to null)
- `github` - String field (set to null)
- `website` - String field (set to null)
- `twitter` - String field (set to null)
- `instagram` - String field (set to null)
- `facebook` - String field (set to null)

### 2. CompanySeeder (`seeders/company-seeder.ts`)
**New Fields Added:**
- `logoId` - Reference to Media model (set to null initially)
- `hrpage` - String field (already in data)
- `hrfields` - String array field (already in data)

### 3. JobSeeder (`seeders/job-seeder.ts`)
**New Fields Added:**
- `validAt` - DateTime field (added to job data)

### 4. PostSeeder (`seeders/post-seeder.ts`)
**New Fields Added:**
- `headerImageId` - Reference to Media model (set to null initially)

### 5. PageSeeder (`seeders/page-seeder.ts`)
**New Fields Added:**
- `headerImgId` - Reference to Media model (set to null initially)

## New Seeders Created

### 1. MediaSeeder (`seeders/media-seeder.ts`)
**Purpose:** Seeds the Media model with sample media files
**Fields:**
- `originalName` - Original filename
- `filename` - Unique filename in system
- `url` - File URL path
- `mimeType` - MIME type of file
- `size` - File size in bytes
- `altText` - Accessibility text
- `type` - MediaType enum (IMAGE, VIDEO, AUDIO, DOCUMENT)

**Sample Data:** 4 sample media files (profile pictures, post headers, company logos, page headers)

### 2. CommentSeeder (`seeders/comment-seeder.ts`)
**Purpose:** Seeds the Comment model with sample comments
**Fields:**
- `content` - Comment text
- `authorId` - Reference to User model
- `postId` - Reference to Post model

**Sample Data:** 5 sample comments distributed across existing posts

### 3. PostLikeSeeder (`seeders/post-like-seeder.ts`)
**Purpose:** Seeds the PostLike model with sample likes
**Fields:**
- `userId` - Reference to User model
- `postId` - Reference to Post model

**Sample Data:** Likes for the first 5 posts by the admin user

### 4. NotificationSeeder (`seeders/notification-seeder.ts`)
**Purpose:** Seeds the Notification model with sample notifications
**Fields:**
- `title` - Notification title
- `content` - Notification content
- `type` - NotificationTypeEnum (yorum, gönderi, hata, yönetim, mesaj)
- `userId` - Reference to User model
- `senderId` - Reference to User model (sender)
- `read` - Boolean flag

**Sample Data:** 5 sample notifications in Turkish

## Updated Configuration Files

### 1. Seeders Index (`seeders/index.ts`)
**Added Exports:**
- `MediaSeeder`
- `CommentSeeder`
- `PostLikeSeeder`
- `NotificationSeeder`

### 2. Orchestrator (`orchestrator.ts`)
**Updated Seeder Order:**
- Added new seeders in correct dependency order
- MediaSeeder runs before PostSeeder, CompanySeeder, and PageSeeder
- CommentSeeder, PostLikeSeeder, and NotificationSeeder run after all other seeders

**Updated Sequence Resets:**
- Added sequences for new tables: `media_id_seq`, `comments_id_seq`, `post_likes_id_seq`, `notifications_id_seq`

### 3. Database Cleaner (`utils/database-cleaner.ts`)
**Updated Cleanup Order:**
- Added `media` model to cleanup order
- Added new sequences to reset list

## Updated Data Files

### 1. Jobs Data (`datas/jobsData.ts`)
**Added Fields:**
- `validAt` - Added to first two jobs with future expiration dates

## Seeding Order

The new seeding order ensures proper dependencies:

1. **PermissionSeeder** - Creates permissions
2. **RoleSeeder** - Creates roles (depends on permissions)
3. **UserSeeder** - Creates users (depends on roles)
4. **CategorySeeder** - Creates categories
5. **MediaSeeder** - Creates media files
6. **PostSeeder** - Creates posts (depends on users, categories, and can reference media)
7. **CompanySeeder** - Creates companies (can reference media)
8. **JobSeeder** - Creates jobs (depends on companies)
9. **TelegramSeeder** - Creates telegram groups
10. **MenuSeeder** - Creates menus
11. **PageSeeder** - Creates pages (can reference media)
12. **SourceSeeder** - Creates sources
13. **EndpointAccessSeeder** - Creates endpoint access
14. **CommentSeeder** - Creates comments (depends on users and posts)
15. **PostLikeSeeder** - Creates post likes (depends on users and posts)
16. **NotificationSeeder** - Creates notifications (depends on users)

## Notes

1. **Media References:** All media references (`profilePictureId`, `logoId`, `headerImageId`, `headerImgId`) are initially set to `null` and can be updated later when the media seeder is enhanced to create actual file relationships.

2. **Foreign Key Dependencies:** The seeding order respects foreign key constraints to avoid errors.

3. **Sample Data:** All new seeders include realistic sample data that matches the expected usage patterns.

4. **Error Handling:** All seeders include proper error handling and logging.

5. **Batch Processing:** All seeders use the existing batch processing system for efficiency.

## Testing

To test the refactored seeders:

1. Run the database migration to ensure schema is up to date
2. Run the seeding process: `npm run seed` or `yarn seed`
3. Verify that all models are seeded correctly
4. Check that foreign key relationships are properly established

## Future Enhancements

1. **Media Relationships:** Enhance MediaSeeder to create actual file relationships with other models
2. **More Sample Data:** Add more diverse sample data for testing
3. **Validation:** Add more validation rules to seeders
4. **Performance:** Optimize seeding performance for large datasets 