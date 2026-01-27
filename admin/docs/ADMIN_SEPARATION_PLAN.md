# Admin Panel Separation Plan

## Overview
This document outlines the plan to separate admin operations from the main frontend application into a dedicated SvelteKit application that will run under an admin subdomain.

## Current State Analysis

### Frontend Admin Components
The current frontend has admin functionality in:
- `/frontend/src/components/Admin/` - Admin-specific components
- `/frontend/src/app/admin/` - Admin routes and pages

**Admin Components:**
- `PagePost.tsx` - Page/post creation and management
- `NewTag.tsx` - Hashtag creation
- `NewMenu.tsx` - Menu management
- `NewRole.tsx` - Role management
- `SideMenu.tsx` - Admin navigation sidebar

**Admin Routes:**
- `/admin` - Dashboard
- `/admin/sayfalar` - Pages management
- `/admin/kullanicilar` - User management
- `/admin/posts` - Posts management
- `/admin/roller` - Roles management
- `/admin/menuler` - Menus management
- `/admin/etiketler` - Hashtags management
- `/admin/kaynaklar` - Sources management
- `/admin/kariyer` - Jobs management
- `/admin/ayarlar` - Settings

### Backend API Structure
The backend provides RESTful APIs with role-based access control:
- Authentication: `/auth/login`, `/auth/me`
- Users: `/users` (admin only)
- Posts: `/posts` (admin/moderator)
- Hashtags: `/hashtags` (admin only for create/update/delete)
- Roles: `/roles` (admin only)
- Menus: `/menus` (admin only)
- Pages: `/pages` (admin only)
- Jobs: `/jobs` (admin/company)
- Sources: `/sources` (admin only)

**Role Middleware:**
- Uses `roleMiddleware(['admin', 'superadmin', 'moderator'])` for protected routes
- Checks user roles from JWT token
- Validates permissions from database

### Authentication Flow
1. User logs in via `/auth/login`
2. Receives JWT token
3. Token stored in session/cookies
4. Token sent as `Authorization: Bearer <token>` header
5. Backend validates token and checks roles

## Target Architecture

### Admin Application (SvelteKit)
- **Location:** `/admin/`
- **Framework:** SvelteKit
- **Subdomain:** `admin.` (e.g., `admin.eksicode.com`)
- **Access Control:** Only admin, superadmin, moderator roles

### Key Features
1. **Authentication System**
   - JWT token-based authentication
   - Role-based route protection
   - Session management
   - Auto-redirect if unauthorized

2. **API Integration**
   - Reuse backend API endpoints
   - API client utilities (similar to frontend)
   - Error handling and retry logic
   - Token refresh mechanism

3. **Admin Dashboard**
   - Statistics overview
   - Quick actions
   - User management
   - Content management

4. **Components to Migrate**
   - Page/Post management
   - Tag/Hashtag management
   - Menu management
   - Role management
   - User management
   - Settings

## Implementation Plan

### Phase 1: SvelteKit Setup
1. Initialize SvelteKit project with TypeScript
2. Configure TailwindCSS for styling
3. Set up project structure
4. Install dependencies

### Phase 2: Authentication & Authorization
1. Create authentication service
2. Implement JWT token management
3. Create role-based route guards
4. Set up session storage
5. Implement auto-redirect for unauthorized users

### Phase 3: API Client Setup
1. Create API client utilities
2. Implement request interceptors for token
3. Add error handling
4. Create data fetching utilities (getData, addData, updateData, deleteData)

### Phase 4: Layout & Navigation
1. Create admin layout component
2. Implement sidebar navigation
3. Add breadcrumb navigation
4. Create header with user info

### Phase 5: Admin Pages Migration
1. Dashboard page
2. User management
3. Post management
4. Page management
5. Menu management
6. Role management
7. Hashtag management
8. Settings page

### Phase 6: Route Protection
1. Implement server-side route protection
2. Add client-side guards
3. Handle subdomain routing
4. Add middleware for role checking

## Technical Stack

### Core
- **Framework:** SvelteKit (latest)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Svelte stores

### Dependencies
- `@sveltejs/kit` - SvelteKit framework
- `@sveltejs/adapter-node` or `@sveltejs/adapter-auto` - Deployment adapter
- `tailwindcss` - CSS framework
- `autoprefixer` - CSS processing
- `postcss` - CSS transformation
- `typescript` - Type checking
- `@types/node` - Node types

### Optional
- `zod` - Schema validation (if needed)
- `date-fns` - Date utilities
- `axios` or `fetch` - HTTP client (SvelteKit has built-in fetch)

## File Structure

```
admin/
├── src/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts          # API client
│   │   │   ├── auth.ts             # Auth API calls
│   │   │   └── types.ts            # API types
│   │   ├── auth/
│   │   │   ├── store.ts            # Auth store
│   │   │   ├── guards.ts           # Route guards
│   │   │   └── utils.ts            # Auth utilities
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.svelte
│   │   │   │   ├── Header.svelte
│   │   │   │   └── Layout.svelte
│   │   │   └── ui/                 # Reusable UI components
│   │   └── utils/
│   │       ├── api.ts              # API utilities
│   │       └── validation.ts       # Validation helpers
│   ├── routes/
│   │   ├── +layout.svelte          # Root layout
│   │   ├── +layout.server.ts      # Server layout (auth check)
│   │   ├── +page.svelte            # Dashboard
│   │   ├── login/
│   │   │   └── +page.svelte
│   │   ├── users/
│   │   │   ├── +page.svelte
│   │   │   └── [id]/
│   │   │       └── +page.svelte
│   │   ├── posts/
│   │   │   └── +page.svelte
│   │   ├── pages/
│   │   │   └── +page.svelte
│   │   ├── menus/
│   │   │   └── +page.svelte
│   │   ├── roles/
│   │   │   └── +page.svelte
│   │   ├── hashtags/
│   │   │   └── +page.svelte
│   │   └── settings/
│   │       └── +page.svelte
│   └── app.html
├── static/
├── package.json
├── tsconfig.json
├── svelte.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

## Environment Variables

```env
PUBLIC_API_URL=http://localhost:9000
PUBLIC_ADMIN_SUBDOMAIN=admin
```

## Security Considerations

1. **Route Protection**
   - Server-side checks in `+layout.server.ts`
   - Client-side guards for UX
   - Middleware for role validation

2. **Token Management**
   - Store tokens securely (httpOnly cookies preferred)
   - Implement token refresh
   - Handle token expiration

3. **CORS Configuration**
   - Configure backend to allow admin subdomain
   - Set proper CORS headers

4. **Subdomain Routing**
   - Configure nginx/reverse proxy for subdomain
   - Ensure proper routing to admin app

## Migration Strategy

1. **Keep Frontend Admin Routes** (temporarily)
   - Maintain existing routes during migration
   - Add deprecation notices
   - Redirect to new admin subdomain when ready

2. **Gradual Migration**
   - Migrate one feature at a time
   - Test thoroughly before removing from frontend
   - Ensure API compatibility

3. **Testing**
   - Test all admin operations
   - Verify role-based access
   - Test authentication flow
   - Verify API integration

## Next Steps

1. ✅ Create this planning document
2. Initialize SvelteKit project
3. Set up basic structure and dependencies
4. Implement authentication system
5. Create API client utilities
6. Build admin layout and navigation
7. Migrate admin pages one by one
8. Configure subdomain routing
9. Remove admin routes from main frontend
10. Update documentation
