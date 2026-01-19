# RBAC Quick Reference Guide

Quick reference for using the Role-Based Access Control system in EksiCode.

## Import Statements

```typescript
// Permission constants
import { PERMISSIONS } from '../constants/permissions';

// Role constants
import { ROLE_NAMES, ROLE_LEVELS } from '../constants/roles';

// Role guard utility
import { RoleGuard } from '../utils/roleGuard';

// Middlewares
import { roleMiddleware, permissionMiddleware, adminMiddleware, superAdminMiddleware } from '../middlewares/role.middleware';
```

## Permission Constants

```typescript
// Post permissions
PERMISSIONS.CREATE_POST
PERMISSIONS.UPDATE_POST
PERMISSIONS.DELETE_POST
PERMISSIONS.APPROVE_POST
PERMISSIONS.VIEW_ALL_POSTS

// User permissions
PERMISSIONS.VIEW_USERS
PERMISSIONS.VIEW_USER
PERMISSIONS.CREATE_USER
PERMISSIONS.UPDATE_USER
PERMISSIONS.DELETE_USER
PERMISSIONS.MANAGE_USER_ROLES

// Comment permissions
PERMISSIONS.DELETE_COMMENT
PERMISSIONS.MODERATE_COMMENTS

// System permissions
PERMISSIONS.MANAGE_SYSTEM
PERMISSIONS.VIEW_ADMIN_PANEL
PERMISSIONS.MANAGE_PERMISSIONS

// Content permissions
PERMISSIONS.MANAGE_CATEGORIES
PERMISSIONS.MANAGE_TAGS
PERMISSIONS.MANAGE_PAGES
PERMISSIONS.MANAGE_MENUS

// Business permissions
PERMISSIONS.MANAGE_COMPANIES
PERMISSIONS.MANAGE_JOBS

// Media permissions
PERMISSIONS.MANAGE_MEDIA
PERMISSIONS.DELETE_MEDIA
```

## Role Constants

```typescript
// Role names
ROLE_NAMES.SUPERADMIN  // Level 0 (highest authority)
ROLE_NAMES.ADMIN       // Level 10
ROLE_NAMES.MODERATOR   // Level 20
ROLE_NAMES.USER        // Level 100 (lowest authority)

// Role levels
ROLE_LEVELS[ROLE_NAMES.SUPERADMIN]  // 0
ROLE_LEVELS[ROLE_NAMES.ADMIN]       // 10
ROLE_LEVELS[ROLE_NAMES.MODERATOR]   // 20
ROLE_LEVELS[ROLE_NAMES.USER]        // 100
```

## RoleGuard Usage

### Basic Permission Checks

```typescript
const roleGuard = new RoleGuard(prisma);
const user = await roleGuard.loadUserWithPermissions(userId);

// Check single permission
if (roleGuard.hasPermission(user, PERMISSIONS.DELETE_USER)) {
  // User has permission
}

// Check any permission
if (roleGuard.hasAnyPermission(user, [PERMISSIONS.UPDATE_POST, PERMISSIONS.DELETE_POST])) {
  // User has at least one of these permissions
}

// Check all permissions
if (roleGuard.hasAllPermissions(user, [PERMISSIONS.CREATE_USER, PERMISSIONS.UPDATE_USER])) {
  // User has all these permissions
}
```

### Role Checks

```typescript
// Check specific role
if (roleGuard.hasRole(user, ROLE_NAMES.ADMIN)) {
  // User is an admin
}

// Check any role
if (roleGuard.hasAnyRole(user, [ROLE_NAMES.ADMIN, ROLE_NAMES.MODERATOR])) {
  // User is admin or moderator
}

// Quick checks
if (roleGuard.isSuperAdmin(user)) {
  // User is superadmin
}

if (roleGuard.isAdmin(user)) {
  // User is admin or superadmin
}

if (roleGuard.isStaff(user)) {
  // User is superadmin, admin, or moderator
}
```

### Hierarchy Checks

```typescript
// Check if user can manage another user
if (roleGuard.canManageUser(adminUser, targetUser)) {
  // Admin has sufficient authority to manage target user
}

// Check if user can assign a role
if (roleGuard.canAssignRole(adminUser, ROLE_NAMES.MODERATOR)) {
  // Admin can assign moderator role
}

// Get user's highest authority level
const level = roleGuard.getHighestRoleLevel(user);
```

### Assert Methods (Throw on Fail)

```typescript
// Assert permission (throws HttpException if not found)
roleGuard.assertPermission(user, PERMISSIONS.DELETE_USER);

// Assert any permission
roleGuard.assertAnyPermission(user, [PERMISSIONS.CREATE_POST, PERMISSIONS.UPDATE_POST]);

// Assert all permissions
roleGuard.assertAllPermissions(user, [PERMISSIONS.MANAGE_MEDIA, PERMISSIONS.DELETE_MEDIA]);

// Assert role
roleGuard.assertRole(user, ROLE_NAMES.ADMIN);

// Assert admin
roleGuard.assertAdmin(user);

// Assert superadmin
roleGuard.assertSuperAdmin(user);

// Assert can manage user
roleGuard.assertCanManageUser(actingUser, targetUser);

// Assert can assign role
roleGuard.assertCanAssignRole(actingUser, ROLE_NAMES.MODERATOR);
```

## Middleware Usage

### Role Middleware

```typescript
// Require specific role
router.get('/admin-dashboard', 
  authMiddleware, 
  roleMiddleware([ROLE_NAMES.ADMIN]), 
  dashboardController.index
);

// Require any of multiple roles
router.get('/staff-area', 
  authMiddleware, 
  roleMiddleware([ROLE_NAMES.ADMIN, ROLE_NAMES.MODERATOR]), 
  staffController.index
);

// Require all roles (rare use case)
router.get('/special', 
  authMiddleware, 
  roleMiddleware([ROLE_NAMES.ADMIN, ROLE_NAMES.MODERATOR], { requireAll: true }), 
  handler
);
```

### Permission Middleware

```typescript
// Require specific permission
router.post('/users', 
  authMiddleware, 
  permissionMiddleware([PERMISSIONS.CREATE_USER]), 
  userController.createUser
);

// Require any permission
router.patch('/posts/:id', 
  authMiddleware, 
  permissionMiddleware([PERMISSIONS.UPDATE_POST, PERMISSIONS.APPROVE_POST], { requireAll: false }), 
  postController.updatePost
);

// Require all permissions (default behavior)
router.delete('/media/:id', 
  authMiddleware, 
  permissionMiddleware([PERMISSIONS.MANAGE_MEDIA, PERMISSIONS.DELETE_MEDIA]), 
  mediaController.deleteMedia
);
```

### Quick Check Middlewares

```typescript
// Require admin (admin or superadmin)
router.get('/admin/*', authMiddleware, adminMiddleware, adminController);

// Require superadmin only
router.get('/superadmin/*', authMiddleware, superAdminMiddleware, superAdminController);
```

## Controller Usage

### In Controller Methods

```typescript
class UserController {
  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      
      // Check permission using service
      const hasPermission = await this.userService.hasPermission(
        userId, 
        PERMISSIONS.CREATE_USER
      );
      
      if (!hasPermission) {
        throw new HttpException(403, 'Permission denied');
      }
      
      // ... create user logic
    } catch (error) {
      next(error);
    }
  }
  
  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const targetUserId = parseInt(req.params.id);
      
      // Using RoleGuard for advanced checks
      const roleGuard = new RoleGuard(this.prisma);
      const actingUser = await roleGuard.loadUserWithPermissions(userId);
      const targetUser = await roleGuard.loadUserWithPermissions(targetUserId);
      
      // Check if can manage user (hierarchy check)
      roleGuard.assertCanManageUser(actingUser, targetUser);
      
      // Check permission
      roleGuard.assertPermission(actingUser, PERMISSIONS.DELETE_USER);
      
      // ... delete user logic
    } catch (error) {
      next(error);
    }
  }
}
```

## Service Usage

```typescript
class UserService {
  private roleGuard: RoleGuard;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.roleGuard = new RoleGuard(prisma);
  }
  
  async assignRole(userId: number, targetUserId: number, roleName: string) {
    // Load users
    const actingUser = await this.roleGuard.loadUserWithPermissions(userId);
    const targetUser = await this.roleGuard.loadUserWithPermissions(targetUserId);
    
    // Check permission
    this.roleGuard.assertPermission(actingUser, PERMISSIONS.MANAGE_USER_ROLES);
    
    // Check if can assign this role
    this.roleGuard.assertCanAssignRole(actingUser, roleName);
    
    // Check if can manage target user
    this.roleGuard.assertCanManageUser(actingUser, targetUser);
    
    // Assign role...
  }
}
```

## Common Patterns

### Pattern 1: Simple Permission Check

```typescript
// In controller
const hasPermission = await this.userService.hasPermission(
  req.userId!, 
  PERMISSIONS.CREATE_POST
);

if (!hasPermission) {
  throw new HttpException(403, 'Permission denied');
}
```

### Pattern 2: Multiple Permission Check

```typescript
// Any of these permissions
const hasAnyPermission = await Promise.all([
  this.userService.hasPermission(userId, PERMISSIONS.UPDATE_POST),
  this.userService.hasPermission(userId, PERMISSIONS.DELETE_POST)
]).then(results => results.some(r => r));

// All of these permissions
const hasAllPermissions = await Promise.all([
  this.userService.hasPermission(userId, PERMISSIONS.MANAGE_MEDIA),
  this.userService.hasPermission(userId, PERMISSIONS.DELETE_MEDIA)
]).then(results => results.every(r => r));
```

### Pattern 3: Owner or Admin Check

```typescript
// Check if user owns resource or is admin
const roleGuard = new RoleGuard(prisma);
const user = await roleGuard.loadUserWithPermissions(userId);

const isOwner = post.authorId === userId;
const isAdmin = roleGuard.isAdmin(user);

if (!isOwner && !isAdmin) {
  throw new HttpException(403, 'You can only edit your own posts');
}
```

### Pattern 4: Hierarchy-based Management

```typescript
// Check if acting user can manage target user
const roleGuard = new RoleGuard(prisma);
const actingUser = await roleGuard.loadUserWithPermissions(actingUserId);
const targetUser = await roleGuard.loadUserWithPermissions(targetUserId);

if (!roleGuard.canManageUser(actingUser, targetUser)) {
  throw new HttpException(403, 'You cannot manage users with equal or higher authority');
}
```

## Testing Tips

```typescript
// For unit tests, mock the RoleGuard
const mockRoleGuard = {
  loadUserWithPermissions: jest.fn(),
  hasPermission: jest.fn().mockReturnValue(true),
  isAdmin: jest.fn().mockReturnValue(true),
  // ... other methods
};

// For integration tests, use actual database
const roleGuard = new RoleGuard(testPrisma);
const user = await roleGuard.loadUserWithPermissions(testUserId);
expect(roleGuard.hasPermission(user, PERMISSIONS.CREATE_POST)).toBe(true);
```

## Troubleshooting

### Permission Not Working

1. Check if permission is defined in `constants/permissions.ts`
2. Check if role has permission in `seed-config.ts`
3. Run `npm run seed` to update database
4. Verify user has the role assigned
5. Check if permission is active in database

### Role Hierarchy Not Working

1. Check role levels in `seed-config.ts`
2. Verify levels are seeded correctly in database
3. Use `getHighestRoleLevel()` to debug user's level
4. Check if using `canManageUser()` correctly

### Middleware Not Working

1. Ensure `authMiddleware` is called before role/permission middleware
2. Check if `req.userId` is set by auth middleware
3. Verify user exists and is active in database
4. Check console for error messages

## Best Practices

1. ✅ Always use permission constants, never hardcoded strings
2. ✅ Use RoleGuard for complex permission logic
3. ✅ Use middleware for route-level protection
4. ✅ Use service-level checks for business logic
5. ✅ Always check hierarchy when managing users
6. ✅ Use assert methods to simplify error handling
7. ✅ Load user with permissions once, reuse the object
8. ❌ Don't bypass RoleGuard with manual queries
9. ❌ Don't hardcode role names or permission strings
10. ❌ Don't forget to run seeds after permission changes

## Admin Panel Quick Access

```typescript
// Admin panel route protection
router.use('/admin', authMiddleware, adminMiddleware);

// Within admin routes
router.get('/admin/users', permissionMiddleware([PERMISSIONS.VIEW_USERS]), handler);
router.post('/admin/users', permissionMiddleware([PERMISSIONS.CREATE_USER]), handler);
router.put('/admin/users/:id', permissionMiddleware([PERMISSIONS.UPDATE_USER]), handler);
router.delete('/admin/users/:id', permissionMiddleware([PERMISSIONS.DELETE_USER]), handler);
```

## Default Admin Credentials

**After seeding, these users are available:**

- **Superadmin:** `superadmin@eksicode.com` / `eksicode2025**`
- **Admin:** `admin@eksicode.com` / `eksicode2025**`
- **Moderator:** `moderator@eksicode.com` / `eksicode2025**`

⚠️ **Change these passwords in production!**

---

For more detailed information, see:
- `ROLE_SYSTEM_REFACTORING.md` - Complete refactoring details
- `prisma/seeders/ADMIN_USERS_SETUP.md` - Admin setup guide
- `src/constants/permissions.ts` - All permission constants
- `src/constants/roles.ts` - All role constants
- `src/utils/roleGuard.ts` - RoleGuard implementation
