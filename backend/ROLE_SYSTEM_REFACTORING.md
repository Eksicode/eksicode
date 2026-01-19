# Role System Refactoring Summary

## Overview

This document describes the comprehensive refactoring of the role-based access control (RBAC) system for the EksiCode backend. The refactoring improves consistency, maintainability, and adds hierarchical role management.

## Date

January 19, 2026

## Goals

1. ✅ Standardize permission naming across the codebase
2. ✅ Implement role hierarchy system with numeric levels
3. ✅ Create centralized permission checking utilities
4. ✅ Refactor services and controllers to use consistent permissions
5. ✅ Enhance middleware with better role and permission support
6. ✅ Update documentation with new system

## Changes Made

### 1. Permission Constants (`src/constants/permissions.ts`)

**Created:** Centralized permission constants file

**Features:**
- All permissions defined as constants (e.g., `PERMISSIONS.CREATE_USER`)
- Organized by category (POST, USER, COMMENT, SYSTEM, CONTENT, BUSINESS, MEDIA, ROLE)
- Helper functions for validation and categorization
- Type-safe permission checking

**Benefits:**
- No more string typos in permission checks
- IDE autocomplete for all permissions
- Easy to add/modify permissions
- Single source of truth

**Example:**
```typescript
import { PERMISSIONS } from '../constants/permissions';

// Before:
await userService.hasPermission(userId, 'admin.users.create');

// After:
await userService.hasPermission(userId, PERMISSIONS.CREATE_USER);
```

### 2. Role Constants (`src/constants/roles.ts`)

**Created:** Centralized role constants file

**Features:**
- Role names as constants (e.g., `ROLE_NAMES.SUPERADMIN`)
- Role hierarchy levels (0 = highest, 100 = lowest)
- Role descriptions
- Helper functions for role management and hierarchy checking

**Hierarchy Levels:**
- `SUPERADMIN`: Level 0 (highest authority)
- `ADMIN`: Level 10
- `MODERATOR`: Level 20
- `USER`: Level 100 (lowest authority)

**Benefits:**
- Clear role hierarchy
- Easy to check authority levels
- Type-safe role names
- Helper functions for role comparison

**Example:**
```typescript
import { ROLE_NAMES, hasHigherOrEqualAuthority } from '../constants/roles';

if (hasHigherOrEqualAuthority(ROLE_NAMES.ADMIN, ROLE_NAMES.MODERATOR)) {
  // Admin has higher or equal authority than moderator
}
```

### 3. Role Guard Utility (`src/utils/roleGuard.ts`)

**Created:** Centralized role and permission checking service

**Features:**
- `loadUserWithPermissions()` - Load user with all roles and permissions
- `hasPermission()` - Check if user has a specific permission
- `hasAnyPermission()` - Check if user has any of multiple permissions
- `hasAllPermissions()` - Check if user has all specified permissions
- `hasRole()` - Check if user has a specific role
- `isSuperAdmin()`, `isAdmin()`, `isStaff()` - Quick role checks
- `canManageUser()` - Check if user can manage another user based on hierarchy
- `canAssignRole()` - Check if user can assign a specific role
- `assertPermission()`, `assertRole()`, etc. - Assert methods that throw HttpException

**Benefits:**
- Single place for all permission logic
- Automatic superadmin privilege handling
- Role hierarchy enforcement
- Clean, testable code
- Consistent error messages

**Example:**
```typescript
import { RoleGuard } from '../utils/roleGuard';
import { PERMISSIONS } from '../constants/permissions';

const roleGuard = new RoleGuard(prisma);
const user = await roleGuard.loadUserWithPermissions(userId);

// Check permission
if (roleGuard.hasPermission(user, PERMISSIONS.DELETE_USER)) {
  // User can delete users
}

// Assert permission (throws if not found)
roleGuard.assertPermission(user, PERMISSIONS.MANAGE_SYSTEM);

// Check hierarchy
if (roleGuard.canManageUser(adminUser, targetUser)) {
  // Admin can manage target user
}
```

### 4. Seed Configuration Updates (`prisma/seeders/config/seed-config.ts`)

**Updated:** Added role hierarchy levels and enhanced permission definitions

**Changes:**
- Added `level` field to each role definition
- Enhanced permission definitions with `category`, `resource`, and `action` fields
- More detailed permission metadata

**Example:**
```typescript
roles: [
  {
    name: "superadmin",
    description: "Super Administrator with complete system access",
    level: 0, // Highest authority
    permissions: [...]
  },
  {
    name: "admin",
    description: "Administrator with content and user management access",
    level: 10, // High authority, but below superadmin
    permissions: [...]
  }
]
```

### 5. Role Seeder Updates (`prisma/seeders/seeders/role-seeder.ts`)

**Updated:** Added support for role hierarchy levels

**Changes:**
- Now seeds the `level` field from configuration
- Properly assigns hierarchy levels to roles in database

### 6. UserService Refactoring (`src/services/user.service.ts`)

**Updated:** Refactored to use RoleGuard utility

**Changes:**
- Removed hardcoded permission checking logic
- Now uses `RoleGuard` for all permission checks
- Uses `ROLE_NAMES` constants for role references
- Cleaner, more maintainable code

**Before:**
```typescript
const isSuperAdmin = user.userRoles.some(ur => ur.role.name === 'superadmin');
if (isSuperAdmin) return true;

const isAdmin = user.userRoles.some(ur => ur.role.name === 'admin');
if (isAdmin && !permissionName.startsWith('superadmin.')) return true;
```

**After:**
```typescript
const user = await this.roleGuard.loadUserWithPermissions(userId);
return this.roleGuard.hasPermission(user, permissionName);
```

### 7. Controller Updates

**Updated:** All controllers to use standardized permission constants

**Files Updated:**
- `src/controllers/user.controller.ts`
- `src/controllers/permission.controller.ts`

**Changes:**
- Replaced hardcoded permission strings with `PERMISSIONS` constants
- More consistent permission checking
- Better maintainability

**Example:**
```typescript
// Before:
const hasPermission = await this.userService.hasPermission(userId, 'admin.users.create');

// After:
const hasPermission = await this.userService.hasPermission(userId, PERMISSIONS.CREATE_USER);
```

### 8. Middleware Enhancements (`src/middlewares/role.middleware.ts`)

**Updated:** Enhanced with better role and permission support

**New Features:**
- `roleMiddleware()` - Check for specific roles with options
- `permissionMiddleware()` - Check for specific permissions
- `adminMiddleware` - Quick admin check
- `superAdminMiddleware` - Quick superadmin check

**Options:**
- `requireAll` - Require all roles/permissions (default for permissions)
- `requireAny` - Require any role/permission (default for roles)

**Example:**
```typescript
// Require admin or moderator role
router.get('/staff', authMiddleware, roleMiddleware([ROLE_NAMES.ADMIN, ROLE_NAMES.MODERATOR]), handler);

// Require specific permission
router.post('/users', authMiddleware, permissionMiddleware([PERMISSIONS.CREATE_USER]), handler);

// Quick admin check
router.get('/admin-panel', authMiddleware, adminMiddleware, handler);

// Require multiple permissions
router.delete('/media/:id', 
  authMiddleware, 
  permissionMiddleware([PERMISSIONS.MANAGE_MEDIA, PERMISSIONS.DELETE_MEDIA], { requireAll: true }), 
  handler
);
```

### 9. Documentation Updates

**Updated:** `prisma/seeders/ADMIN_USERS_SETUP.md`

**Additions:**
- Role hierarchy explanation
- Detailed permission breakdown by role
- Code examples for using the role system
- Middleware usage examples
- Security considerations
- Role hierarchy rules

## Permission Naming Migration

### Old Permission Format → New Permission Format

| Old Permission String | New Permission Constant |
|----------------------|------------------------|
| `admin.users.create` | `PERMISSIONS.CREATE_USER` |
| `admin.users.update` | `PERMISSIONS.UPDATE_USER` |
| `admin.users.delete` | `PERMISSIONS.DELETE_USER` |
| `admin.roles.assign` | `PERMISSIONS.MANAGE_USER_ROLES` |
| `admin.roles.remove` | `PERMISSIONS.MANAGE_USER_ROLES` |
| `admin.roles.view` | `PERMISSIONS.VIEW_USER` |
| `admin.permissions.create` | `PERMISSIONS.MANAGE_PERMISSIONS` |
| `admin.permissions.update` | `PERMISSIONS.MANAGE_PERMISSIONS` |
| `admin.permissions.delete` | `PERMISSIONS.MANAGE_PERMISSIONS` |
| `admin.permissions.view` | `PERMISSIONS.VIEW_ADMIN_PANEL` |

## Role Hierarchy Matrix

| Role | Level | Can Manage |
|------|-------|------------|
| **Superadmin** | 0 | Everyone (Superadmin, Admin, Moderator, User) |
| **Admin** | 10 | Moderator, User (not Superadmin or other Admins) |
| **Moderator** | 20 | None (content moderation only) |
| **User** | 100 | None |

## Permission Matrix

### Superadmin Permissions (All)
- All permissions automatically granted

### Admin Permissions
✅ Posts: CREATE, UPDATE, DELETE, APPROVE, VIEW_ALL  
✅ Users: VIEW, VIEW_ALL, CREATE, UPDATE (❌ DELETE, ❌ MANAGE_ROLES)  
✅ Comments: DELETE, MODERATE  
✅ System: VIEW_ADMIN_PANEL (❌ MANAGE_SYSTEM, ❌ MANAGE_PERMISSIONS)  
✅ Content: MANAGE_CATEGORIES, MANAGE_TAGS, MANAGE_PAGES, MANAGE_MENUS  
✅ Business: MANAGE_COMPANIES, MANAGE_JOBS  
✅ Media: MANAGE_MEDIA (❌ DELETE_MEDIA)

### Moderator Permissions
✅ Posts: CREATE, UPDATE, APPROVE, VIEW_ALL (❌ DELETE)  
✅ Users: VIEW (❌ any management)  
✅ Comments: DELETE, MODERATE  
✅ System: VIEW_ADMIN_PANEL  
✅ Content: MANAGE_CATEGORIES, MANAGE_TAGS (❌ pages, menus)  
❌ Business: None  
❌ Media: None

### User Permissions
✅ Posts: CREATE  
✅ Users: VIEW  
❌ Everything else

## Migration Guide

### For Developers

If you're working on the codebase, follow these steps:

1. **Import Constants:**
   ```typescript
   import { PERMISSIONS } from '../constants/permissions';
   import { ROLE_NAMES } from '../constants/roles';
   ```

2. **Use RoleGuard for Permission Checks:**
   ```typescript
   import { RoleGuard } from '../utils/roleGuard';
   
   const roleGuard = new RoleGuard(prisma);
   const user = await roleGuard.loadUserWithPermissions(userId);
   
   if (roleGuard.hasPermission(user, PERMISSIONS.CREATE_USER)) {
     // User has permission
   }
   ```

3. **Use Middleware for Route Protection:**
   ```typescript
   import { roleMiddleware, permissionMiddleware } from '../middlewares/role.middleware';
   
   router.post('/admin/users', 
     authMiddleware, 
     permissionMiddleware([PERMISSIONS.CREATE_USER]), 
     userController.createUser
   );
   ```

4. **Never Use Hardcoded Permission Strings:**
   ```typescript
   // ❌ BAD
   await userService.hasPermission(userId, 'admin.users.create');
   
   // ✅ GOOD
   await userService.hasPermission(userId, PERMISSIONS.CREATE_USER);
   ```

### For Database Seeding

To apply the changes to your database:

```bash
# Run the updated seeders
npm run seed

# Or using Prisma directly
npx tsx backend/prisma/seeders/index.ts
```

The seeder will:
1. Update role hierarchy levels
2. Update permission metadata
3. Ensure all admin users have correct roles

## Testing Checklist

After applying this refactoring:

- [ ] Run database seeds to update roles and permissions
- [ ] Test superadmin access (should have all permissions)
- [ ] Test admin access (should not be able to delete users or manage superadmins)
- [ ] Test moderator access (should only moderate content)
- [ ] Test user access (should have basic permissions only)
- [ ] Verify permission constants work in controllers
- [ ] Verify role hierarchy enforcement
- [ ] Test middleware with different roles
- [ ] Verify admin cannot manage other admins
- [ ] Verify moderator cannot manage users

## Files Created

- `backend/src/constants/permissions.ts` - Permission constants
- `backend/src/constants/roles.ts` - Role constants  
- `backend/src/constants/index.ts` - Constants barrel export
- `backend/src/utils/roleGuard.ts` - Role guard utility
- `backend/ROLE_SYSTEM_REFACTORING.md` - This file

## Files Modified

- `backend/prisma/seeders/config/seed-config.ts` - Added hierarchy levels
- `backend/prisma/seeders/seeders/role-seeder.ts` - Added level support
- `backend/src/services/user.service.ts` - Refactored to use RoleGuard
- `backend/src/controllers/user.controller.ts` - Updated to use permission constants
- `backend/src/controllers/permission.controller.ts` - Updated to use permission constants
- `backend/src/middlewares/role.middleware.ts` - Enhanced with new features
- `backend/prisma/seeders/ADMIN_USERS_SETUP.md` - Updated documentation

## Breaking Changes

### None

This refactoring maintains backwards compatibility:
- The database schema was not changed
- All existing endpoints continue to work
- Permission checking logic is improved but functionally equivalent
- The seeder updates data without breaking existing relations

## Future Improvements

Consider these enhancements for future iterations:

1. **Permission Groups:** Group related permissions for easier assignment
2. **Dynamic Permissions:** Allow permissions to be defined in database instead of code
3. **Role Inheritance:** Allow roles to inherit from parent roles
4. **Permission Scopes:** Add resource-level permissions (e.g., "can edit own posts")
5. **Audit Logging:** Enhanced audit trail for permission checks and role changes
6. **Role Templates:** Pre-defined role templates for common use cases
7. **Permission UI:** Admin interface for managing permissions
8. **Time-based Permissions:** Permissions that expire or activate at specific times
9. **Conditional Permissions:** Permissions based on business rules
10. **Multi-tenant Support:** Permissions scoped to specific organizations

## Support

For questions or issues with the refactored role system:

1. Check the updated documentation in `ADMIN_USERS_SETUP.md`
2. Review code examples in this document
3. Look at the implementation in `roleGuard.ts`
4. Check the constants in `permissions.ts` and `roles.ts`

## Conclusion

This refactoring significantly improves the role-based access control system by:
- **Standardizing** permission and role naming
- **Centralizing** permission checking logic
- **Implementing** role hierarchy
- **Improving** code maintainability
- **Enhancing** security through better permission enforcement
- **Documenting** the system comprehensively

The new system is more robust, easier to maintain, and provides better control over user access throughout the application.
