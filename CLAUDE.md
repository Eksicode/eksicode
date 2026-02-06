# EksiCode Project Documentation

## Project Overview

EksiCode is a Turkish developer community platform with three main components:
- **Backend**: Express.js REST API with PostgreSQL/Prisma
- **Frontend**: Next.js 16 public-facing website
- **Admin**: SvelteKit admin dashboard

---

## Architecture Summary

```
eksicode-latest/
├── backend/          # Express.js API (Port 9000)
├── frontend/         # Next.js 16 App (Port 3000)
├── admin/            # SvelteKit Admin Panel (Port 5173)
└── CLAUDE.md         # This documentation
```

---

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT with bcrypt password hashing
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, rate-limiting
- **File Upload**: Multer
- **Email**: Nodemailer

### Frontend
- **Framework**: Next.js 16.0.0 (App Router)
- **React**: 19.0.0
- **Auth**: NextAuth 5.0.0-beta.25
- **State**: TanStack React Query 5.64
- **Styling**: Tailwind CSS 3.4
- **Rich Text**: Quill 2.0.3

### Admin
- **Framework**: SvelteKit 2.0
- **Svelte**: 5.0
- **Build**: Vite 5.0
- **Styling**: Tailwind CSS 3.4

---

## Database Entities (Prisma Schema)

| Entity | Description |
|--------|-------------|
| User | Core user with auth, profile, social links |
| Role | Role hierarchy with levels |
| Permission | Granular permissions by resource/action |
| UserRole | User-role assignments with metadata |
| Post | Blog posts with status, approval, view count |
| Comment | Post comments |
| Tag | Hashtags for posts and sources |
| PostCategory | Post categories |
| PostLike | Like tracking |
| Page | Static CMS pages |
| Company | Company profiles |
| Job | Job listings |
| Source | Content sources with approval |
| Media | File uploads (images, videos, docs) |
| Notification | User notifications |
| TelegramGroup | Telegram group integration |
| Menu | Navigation menus |
| MenuCategory | Menu categories |

---

## Backend API Endpoints

### Authentication (`/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | User registration | Public |
| POST | /auth/login | User login | Public |
| GET | /auth/verify-email/:token | Email verification | Public |
| POST | /auth/resend-verification | Resend verification | Public |
| POST | /auth/forgot-password | Password reset request | Public |
| POST | /auth/reset-password | Reset password | Public |
| GET | /auth/me | Get current user | Protected |
| POST | /auth/logout | Logout | Protected |

### Users (`/users`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /users | List all users | Protected |
| GET | /users/:id | Get user by ID | Protected |
| POST | /users | Create user | Admin |
| PUT | /users/:id | Update user | Protected |
| DELETE | /users/:id | Delete user | Protected |
| POST | /users/:userId/roles | Assign role | Admin |
| DELETE | /users/:userId/roles | Remove role | Admin |

### Posts (`/posts`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /posts | List posts | Public |
| GET | /posts/search | Search posts | Public |
| GET | /posts/:slug | Get by slug | Public |
| POST | /posts | Create post | Protected |
| PUT | /posts/:id | Update post | Protected |
| DELETE | /posts/:id | Delete post | Protected |

### Jobs (`/jobs`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /jobs | List jobs | Public |
| GET | /jobs/id/:id | Get by ID | Public |
| GET | /jobs/slug/:slug | Get by slug | Public |
| POST | /jobs | Create job | Admin |
| PUT | /jobs/:id | Update job | Admin |
| DELETE | /jobs/:id | Delete job | Admin |

### Other Resources
- `/roles` - Role management (Admin)
- `/permissions` - Permission management (Admin)
- `/sources` - Content sources (Public read, Admin write)
- `/hashtags` - Tag management (Public read, Admin write)
- `/pages` - CMS pages (Public read, Admin write)
- `/companies` - Company profiles (Public read, Admin write)
- `/media` - File uploads (Protected)
- `/menus` - Navigation menus (Public read, Admin write)
- `/menu-categories` - Menu categories (Admin)
- `/telegrams` - Telegram groups (Public read, Protected write)

---

## Frontend Pages

### Public Pages
| Route | Description | Status |
|-------|-------------|--------|
| `/` | Home page with posts feed | Complete |
| `/posts` | Posts listing | Complete |
| `/posts/[post]` | Post detail | Complete |
| `/posts/create` | Create post | Complete |
| `/etiketler` | Tags/hashtags | Complete |
| `/kaynaklar` | Resources | Complete |
| `/telegram-gruplari` | Telegram groups | Complete |
| `/kariyer` | Job listings | Complete |
| `/kunye` | Credits page | Complete |
| `/iletisim` | Contact | Complete |
| `/arama` | Search | Complete |

### Auth Pages
| Route | Description | Status |
|-------|-------------|--------|
| `/auth/uye-giris` | Login | Complete |
| `/auth/uye-ol` | Register | Complete |
| `/auth/sifremi-unuttum` | Forgot password | Complete |
| `/auth/resend-verification` | Resend verification | Complete |
| `/confirm-email/[token]` | Email verification | Complete |

### Profile Pages (Protected)
| Route | Description | Status |
|-------|-------------|--------|
| `/profile` | Dashboard | Complete |
| `/profile/posts` | User's posts | Complete |
| `/profile/bildirimler` | Notifications | Stub |
| `/profile/ayarlar` | Settings | Partial |
| `/profile/ayarlar/sifre-degistir` | Change password | Partial |
| `/profile/favoriler` | Favorites | **STUB** |
| `/profile/etiketler` | Followed tags | **STUB** |
| `/profile/kariyer` | Career | **STUB** |
| `/profile/kaynaklar` | Saved resources | **STUB** |

---

## Admin Panel Pages

| Route | Description | CRUD | Status |
|-------|-------------|------|--------|
| `/` | Dashboard | Read | Complete |
| `/users` | User management | Full | Complete |
| `/posts` | Post management | Full | Complete |
| `/roles` | Role management | Full | Complete |
| `/pages` | CMS pages | Full | Complete |
| `/hashtags` | Tag management | Full | Complete |
| `/sources` | Source management | Full | Complete |
| `/telegram-groups` | Telegram groups | Full | Complete |
| `/jobs` | Job listings | Full | Complete |
| `/menus` | Menu management | Full | Complete |
| `/settings` | System settings | R/U | Partial |
| `/profile` | Admin profile | R/U | Partial |
| `/login` | Admin login | N/A | Complete |

---

## Absent/Missing Features

### Backend - Missing Endpoints
| Feature | Description | Priority |
|---------|-------------|----------|
| Comments CRUD | No routes for comment management | High |
| Post Like/Unlike | PostLike model exists but no endpoints | High |
| Notifications List | No endpoint to retrieve user notifications | Medium |
| Mark Notification Read | No endpoint to mark notifications as read | Medium |
| User Follow/Unfollow | No social following system | Medium |
| Job Employment Filter | Commented out in searchJobs | Low |
| Telegram Verification | TelegramVerification model unused | Low |
| Source Approval Workflow | No dedicated approval endpoint | Low |
| Audit Trail Retrieval | UserRole/UserPermission have audit fields but no endpoints | Low |

### Frontend - Missing Pages/Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Comment Posting | UI exists but no submit handler | High |
| Like/Bookmark | Buttons exist but non-functional | High |
| Profile Settings Submit | Form exists but no submission | High |
| Edit Post | No edit functionality | High |
| Delete Post | No delete functionality | High |
| User Profile View | No `/user/[username]` page | Medium |
| Post Filtering | No category/tag filters on feed | Medium |
| Post Sorting | No sort options (newest, trending) | Medium |
| Notifications Data | Page exists but empty | Medium |
| Favorites Functionality | Stub page only | Medium |
| Tag Following | Stub page only | Medium |
| Draft Posts | No draft saving | Low |
| Social Sharing | No share buttons | Low |

### Admin - Missing Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Comments Management | Permission exists but no page | High |
| Categories Management | No dedicated page | Medium |
| 2FA Implementation | Button exists but non-functional | Medium |
| Session Management | Hardcoded display, no real data | Medium |
| SMTP Password Field | Missing in settings | Medium |
| Bulk Operations | No bulk delete/approve | Low |
| Search on All Pages | Only roles page has search | Low |
| Export/Import | No data export features | Low |
| Audit Logs | No logging pages | Low |
| Analytics Dashboard | No reporting | Low |

---

## Role-Based Access Control

### Default Roles
| Role | Level | Description |
|------|-------|-------------|
| superadmin | 0 | Full system access |
| admin | 10 | Administrative access |
| moderator | 20 | Content moderation |
| user | 100 | Standard user |

### Permission Categories
1. User Management (user.read, user.write, user.delete, user.manage_roles)
2. Post Management (post.read, post.write, post.delete, post.approve)
3. Comment Management (comment.read, comment.write, comment.delete, comment.moderate)
4. Page Management (page.read, page.write, page.delete)
5. Role Management (role.read, role.write, role.delete)
6. Hashtag Management (hashtag.read, hashtag.write, hashtag.delete)
7. Source Management (source.read, source.write, source.delete)
8. Telegram Management (telegram.read, telegram.write, telegram.delete)
9. System Settings (settings.read, settings.write)

---

## Development Commands

### Backend
```bash
cd backend
npm install
npm run dev       # Development with nodemon
npm run build     # TypeScript compilation
npm start         # Production server
npx prisma migrate dev    # Run migrations
npx prisma db seed        # Seed database
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # Development server (port 3000)
npm run build     # Production build
npm start         # Production server
```

### Admin
```bash
cd admin
npm install
npm run dev       # Development server (port 5173)
npm run build     # Production build
npm run preview   # Preview production build
```

---

## Environment Variables

### Backend (`backend/.env`)
```
NODE_ENV=development
PORT=9000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
ALLOWED_ORIGINS=http://localhost:3000
FRONTEND_HOST=http://localhost:3000
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...
```

### Frontend (`frontend/.env`)
```
NEXT_PUBLIC_API_URL=http://localhost:9000
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### Admin (`admin/.env`)
```
PUBLIC_API_URL=http://localhost:9000
```

---

## Key Files Reference

### Backend
- `src/app.ts` - Express app setup
- `src/server.ts` - Server entry point with clustering
- `src/routes/*.route.ts` - API route definitions
- `src/controllers/*.controller.ts` - Request handlers
- `src/services/*.service.ts` - Business logic
- `src/middlewares/*.middleware.ts` - Auth, validation, etc.
- `prisma/schema.prisma` - Database schema

### Frontend
- `src/app/layout.tsx` - Root layout
- `src/app/**/page.tsx` - Page components
- `src/components/**/*.tsx` - React components
- `src/services/*.ts` - API service classes
- `src/hooks/*.ts` - Custom React hooks
- `src/types/*.ts` - TypeScript definitions

### Admin
- `src/routes/**/+page.svelte` - Page components
- `src/lib/components/**/*.svelte` - Svelte components
- `src/lib/api/client.ts` - API client
- `src/lib/auth/store.ts` - Auth state management

---

## Priority Implementation Roadmap

### Phase 1: Core Functionality (High Priority)
1. Backend: Add comment CRUD endpoints
2. Backend: Add post like/unlike endpoints
3. Frontend: Implement comment posting
4. Frontend: Implement like/bookmark functionality
5. Frontend: Add post edit/delete
6. Admin: Add comments management page

### Phase 2: User Experience (Medium Priority)
1. Frontend: Complete profile settings
2. Frontend: Add notifications display
3. Frontend: Implement favorites/bookmarks
4. Frontend: Add user profile pages
5. Frontend: Add post filtering/sorting
6. Admin: Implement 2FA
7. Admin: Add bulk operations

### Phase 3: Enhancement (Low Priority)
1. Backend: Add analytics endpoints
2. Frontend: Add social sharing
3. Frontend: Add draft posts
4. Admin: Add audit logging
5. Admin: Add export/import
6. All: Add comprehensive testing

---

## Notes for Claude

- The codebase is Turkish language (UI text in Turkish)
- Follow existing patterns when adding new features
- Use TypeScript strict mode
- Use Zod for request validation
- Follow RBAC permission system for new endpoints
- Test with existing role hierarchy
- Maintain consistency with Tailwind CSS classes
- Use existing component patterns (Table, Modal, Button, Input)
