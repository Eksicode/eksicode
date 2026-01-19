# Admin Users Setup

This document describes the admin users that are automatically created during database seeding.

## Admin Users

The seeding system creates three administrative users with different levels of access based on a role hierarchy system.

### Role Hierarchy

The system uses numeric levels to define role authority (lower number = higher authority):
- **Level 0:** Super Administrator (highest authority)
- **Level 10:** Administrator
- **Level 20:** Moderator
- **Level 100:** Regular User (lowest authority)

### 1. Super Administrator
- **Email:** `superadmin@eksicode.com`
- **Username:** `superadmin`
- **Role:** `superadmin`
- **Hierarchy Level:** 0
- **Access Level:** Complete system access including system settings, user management, and all permissions
- **Special Privileges:** Can manage all users regardless of their role level

### 2. Administrator 
- **Email:** `admin@eksicode.com`
- **Username:** `admin`  
- **Role:** `admin`
- **Hierarchy Level:** 10
- **Access Level:** Content and user management access (cannot delete users or manage system settings)
- **Limitations:** Cannot manage superadmin accounts; can manage moderators and regular users

### 3. Moderator
- **Email:** `moderator@eksicode.com`
- **Username:** `moderator`
- **Role:** `moderator` 
- **Hierarchy Level:** 20
- **Access Level:** Content moderation and limited management access
- **Limitations:** Cannot manage users; focused on content moderation

## Default Password

All admin users are created with the same default password defined in the seed configuration:
- **Password:** `eksicode2025**`

⚠️ **Security Notice:** Change these passwords immediately after initial setup in production environments.

## Roles and Permissions

The system uses a granular permission model with the following categories:
- **Content Permissions:** Posts, comments, categories, tags, pages, menus
- **User Management Permissions:** User CRUD operations, role assignments
- **System Permissions:** Admin panel access, system settings, permission management
- **Business Permissions:** Companies and job postings
- **Media Permissions:** Media file management

### SuperAdmin Permissions (Level 0)
**All Permissions** - Superadmin has complete system access and automatically inherits all permissions.

Explicit permissions include:
- **Posts:** CREATE_POST, UPDATE_POST, DELETE_POST, APPROVE_POST, VIEW_ALL_POSTS
- **Users:** VIEW_USERS, VIEW_USER, CREATE_USER, UPDATE_USER, DELETE_USER, MANAGE_USER_ROLES
- **Comments:** DELETE_COMMENT, MODERATE_COMMENTS
- **System:** MANAGE_SYSTEM, VIEW_ADMIN_PANEL, MANAGE_PERMISSIONS
- **Content:** MANAGE_CATEGORIES, MANAGE_TAGS, MANAGE_PAGES, MANAGE_MENUS
- **Business:** MANAGE_COMPANIES, MANAGE_JOBS
- **Media:** MANAGE_MEDIA, DELETE_MEDIA

### Admin Permissions (Level 10)
**Cannot:** Delete users, manage system settings, manage permissions, delete media

Explicit permissions:
- **Posts:** CREATE_POST, UPDATE_POST, DELETE_POST, APPROVE_POST, VIEW_ALL_POSTS
- **Users:** VIEW_USERS, VIEW_USER, CREATE_USER, UPDATE_USER (no DELETE_USER, no MANAGE_USER_ROLES)
- **Comments:** DELETE_COMMENT, MODERATE_COMMENTS
- **System:** VIEW_ADMIN_PANEL (no MANAGE_SYSTEM, no MANAGE_PERMISSIONS)
- **Content:** MANAGE_CATEGORIES, MANAGE_TAGS, MANAGE_PAGES, MANAGE_MENUS
- **Business:** MANAGE_COMPANIES, MANAGE_JOBS
- **Media:** MANAGE_MEDIA (no DELETE_MEDIA)

### Moderator Permissions (Level 20)
**Focused on content moderation** with limited management access.

Explicit permissions:
- **Posts:** CREATE_POST, UPDATE_POST, APPROVE_POST, VIEW_ALL_POSTS (no DELETE_POST)
- **Users:** VIEW_USER (cannot manage users)
- **Comments:** DELETE_COMMENT, MODERATE_COMMENTS
- **System:** VIEW_ADMIN_PANEL
- **Content:** MANAGE_CATEGORIES, MANAGE_TAGS (no pages or menus)
- **Business:** None
- **Media:** None

### User Permissions (Level 100)
**Basic user access** for regular members.

Explicit permissions:
- **Posts:** CREATE_POST
- **Users:** VIEW_USER

## Configuration

Admin users are configured in `/backend/prisma/seeders/config/seed-config.ts` in the `defaultUsers` array. 

### Permission Constants

All permissions are defined as constants in `/backend/src/constants/permissions.ts` for consistency:
- `PERMISSIONS.CREATE_POST`
- `PERMISSIONS.UPDATE_USER`
- `PERMISSIONS.MANAGE_PERMISSIONS`
- etc.

### Role Constants

All roles are defined as constants in `/backend/src/constants/roles.ts`:
- `ROLE_NAMES.SUPERADMIN`
- `ROLE_NAMES.ADMIN`
- `ROLE_NAMES.MODERATOR`
- `ROLE_NAMES.USER`

To modify admin users:
1. Edit the `defaultUsers` configuration in `seed-config.ts`
2. Run database seeding: `npm run seed` or `npx prisma db seed`

## Database Relations

Each admin user is linked to their role through the `UserRole` junction table, which allows for:
- Multiple roles per user (if needed in the future)
- Role-based access control with hierarchy levels
- Permission inheritance through roles
- Audit trail with `assignedBy`, `assignedAt` fields
- Temporary role deactivation with `active` flag
- Role expiration with `expiresAt` field

## Security Features

- **Password Hashing:** Passwords are hashed using bcrypt with configurable rounds (default: 10)
- **Email Verification:** Email verification status can be set
- **Account Verification:** Account verification status can be controlled
- **Default Verification:** All admin accounts are verified and email-verified by default
- **Role Hierarchy:** Lower-level roles cannot manage higher-level roles
- **Permission Isolation:** Permissions are checked through a centralized RoleGuard utility
- **Audit Trail:** All role assignments track who assigned them and when

## Running Seeds

To create/update admin users:

```bash
# Run all seeds (recommended)
npm run seed

# Or run specific seeder
npx tsx backend/prisma/seeders/index.ts
```

The UserSeeder will:
1. Create users if they don't exist
2. Update existing users with current configuration
3. Assign proper roles and permissions
4. Hash passwords securely

## Troubleshooting

If admin users are not created:
1. Ensure roles are seeded first (PermissionSeeder → RoleSeeder → UserSeeder)
2. Check that the database connection is working
3. Verify no unique constraint violations (email/username conflicts)
4. Check seeder logs for specific error messages

## Using the Role System in Code

### Checking Permissions

```typescript
import { RoleGuard } from '../utils/roleGuard';
import { PERMISSIONS } from '../constants/permissions';

const roleGuard = new RoleGuard(prisma);
const user = await roleGuard.loadUserWithPermissions(userId);

// Check single permission
if (roleGuard.hasPermission(user, PERMISSIONS.DELETE_USER)) {
  // User can delete users
}

// Check multiple permissions (any)
if (roleGuard.hasAnyPermission(user, [PERMISSIONS.DELETE_POST, PERMISSIONS.UPDATE_POST])) {
  // User can either delete or update posts
}

// Check multiple permissions (all)
if (roleGuard.hasAllPermissions(user, [PERMISSIONS.CREATE_USER, PERMISSIONS.UPDATE_USER])) {
  // User can both create and update users
}

// Check role
if (roleGuard.isAdmin(user)) {
  // User is admin or superadmin
}
```

### Using Middlewares

```typescript
import { roleMiddleware, permissionMiddleware, adminMiddleware } from '../middlewares/role.middleware';
import { ROLE_NAMES } from '../constants/roles';
import { PERMISSIONS } from '../constants/permissions';

// Require specific role
router.get('/admin-only', authMiddleware, roleMiddleware([ROLE_NAMES.ADMIN]), handler);

// Require any of multiple roles
router.get('/staff-only', authMiddleware, roleMiddleware([ROLE_NAMES.ADMIN, ROLE_NAMES.MODERATOR]), handler);

// Require specific permission
router.post('/users', authMiddleware, permissionMiddleware([PERMISSIONS.CREATE_USER]), handler);

// Quick admin check
router.get('/admin-panel', authMiddleware, adminMiddleware, handler);
```

## Environment Considerations

- **Development:** Default credentials are acceptable
- **Staging:** Change passwords and use environment-specific emails  
- **Production:** Always change default passwords and use secure email addresses

## Role Hierarchy Rules

1. **Superadmin (Level 0)** can manage everyone
2. **Admin (Level 10)** can manage moderators and users, but not other admins or superadmins
3. **Moderator (Level 20)** cannot manage any users
4. **User (Level 100)** has no management capabilities

The system automatically enforces these rules through the `RoleGuard.canManageUser()` method.
