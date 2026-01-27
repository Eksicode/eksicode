# Backend Permissions Setup for Admin Panel

## 🔐 Overview

The admin panel requires specific permissions to be configured in the backend for proper functionality. This document outlines the required permissions and how to set them up.

## ❗ 403 Forbidden Error - Common Cause

If you're seeing **403 Forbidden** errors when accessing admin panel features (like `/roles`), it means:

1. The user doesn't have the required permission
2. The permission hasn't been created in the database
3. The role hasn't been assigned the required permission

## 📋 Required Permissions for Roles Management

### Core Permission
```
admin.roles.view
```

This permission is **required** to access the roles management page (`/roles`).

### Additional Role Permissions
```
admin.roles.create   - Create new roles
admin.roles.edit     - Edit existing roles  
admin.roles.delete   - Delete roles
admin.roles.assign   - Assign roles to users
```

## 🔧 Backend Implementation

### Role Controller Check (from backend code)

```typescript
// backend/src/controllers/role.controller.ts
public getAllRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new HttpException(401, 'Authentication required');
    }

    // This is what's causing the 403 error
    const hasPermission = await this.userService.hasPermission(userId, 'admin.roles.view');
    if (!hasPermission) {
      throw new HttpException(403, 'Admin access required');
    }

    const roles = await this.rolePermissionService.getAllRoles();
    // ...
  }
};
```

## 🛠️ How to Fix the 403 Error

### Option 1: Add Permission to Database

Run this SQL to create the required permissions:

```sql
-- Create the permissions
INSERT INTO "Permission" (name, description, category, "createdAt", "updatedAt") VALUES
  ('admin.roles.view', 'View roles and permissions', 'admin', NOW(), NOW()),
  ('admin.roles.create', 'Create new roles', 'admin', NOW(), NOW()),
  ('admin.roles.edit', 'Edit existing roles', 'admin', NOW(), NOW()),
  ('admin.roles.delete', 'Delete roles', 'admin', NOW(), NOW()),
  ('admin.roles.assign', 'Assign roles to users', 'admin', NOW(), NOW());
```

### Option 2: Assign Permission to Admin Role

```sql
-- Find your admin role ID (example: id = 1)
-- Find the permission ID (example: id = 100)

INSERT INTO "RolePermission" ("roleId", "permissionId", "createdAt", "updatedAt") VALUES
  (1, 100, NOW(), NOW());  -- Replace with actual IDs
```

### Option 3: Create a Script

Create a backend script to set up all permissions:

```typescript
// backend/scripts/setupPermissions.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupRolePermissions() {
  // Create permissions
  const permissions = [
    { name: 'admin.roles.view', description: 'View roles and permissions', category: 'admin' },
    { name: 'admin.roles.create', description: 'Create new roles', category: 'admin' },
    { name: 'admin.roles.edit', description: 'Edit existing roles', category: 'admin' },
    { name: 'admin.roles.delete', description: 'Delete roles', category: 'admin' },
    { name: 'admin.roles.assign', description: 'Assign roles to users', category: 'admin' }
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm
    });
  }

  // Assign to admin role
  const adminRole = await prisma.role.findFirst({ where: { name: 'admin' } });
  if (adminRole) {
    for (const perm of permissions) {
      const permission = await prisma.permission.findFirst({ where: { name: perm.name } });
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: adminRole.id,
              permissionId: permission.id
            }
          },
          update: {},
          create: {
            roleId: adminRole.id,
            permissionId: permission.id
          }
        });
      }
    }
  }

  console.log('✅ Role permissions set up successfully');
}

setupRolePermissions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run with:
```bash
cd backend
npx ts-node scripts/setupPermissions.ts
```

## 📊 Complete Permission List for Admin Panel

Based on the frontend implementation, here are ALL permissions that should be created:

### User Management
```
user.read               - View users
user.write              - Create/edit users
user.delete             - Delete users
user.manage_roles       - Assign roles to users
```

### Post Management
```
post.read               - View posts
post.write              - Create/edit posts
post.delete             - Delete posts
post.approve            - Approve posts
```

### Comment Management
```
comment.read            - View comments
comment.write           - Create/edit comments
comment.delete          - Delete comments
comment.moderate        - Moderate comments
```

### Page Management
```
page.read               - View pages
page.write              - Create/edit pages
page.delete             - Delete pages
```

### Role Management
```
role.read               - View roles (also needs admin.roles.view)
role.write              - Create/edit roles
role.delete             - Delete roles
admin.roles.view        - Backend permission for role controller
```

### Hashtag Management
```
hashtag.read            - View hashtags
hashtag.write           - Create/edit hashtags
hashtag.delete          - Delete hashtags
```

### Source Management
```
source.read             - View sources
source.write            - Create/edit sources
source.delete           - Delete sources
```

### Telegram Group Management
```
telegram.read           - View Telegram groups
telegram.write          - Create/edit Telegram groups
telegram.delete         - Delete Telegram groups
```

### System Settings
```
settings.read           - View system settings
settings.write          - Edit system settings
```

## 🚀 Quick Setup Script

Create a complete setup script:

```typescript
// backend/scripts/setupAllPermissions.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ALL_PERMISSIONS = [
  // User Management
  { name: 'user.read', description: 'View users', category: 'users' },
  { name: 'user.write', description: 'Create/edit users', category: 'users' },
  { name: 'user.delete', description: 'Delete users', category: 'users' },
  { name: 'user.manage_roles', description: 'Assign roles to users', category: 'users' },
  
  // Post Management
  { name: 'post.read', description: 'View posts', category: 'posts' },
  { name: 'post.write', description: 'Create/edit posts', category: 'posts' },
  { name: 'post.delete', description: 'Delete posts', category: 'posts' },
  { name: 'post.approve', description: 'Approve posts', category: 'posts' },
  
  // Comment Management
  { name: 'comment.read', description: 'View comments', category: 'comments' },
  { name: 'comment.write', description: 'Create/edit comments', category: 'comments' },
  { name: 'comment.delete', description: 'Delete comments', category: 'comments' },
  { name: 'comment.moderate', description: 'Moderate comments', category: 'comments' },
  
  // Page Management
  { name: 'page.read', description: 'View pages', category: 'pages' },
  { name: 'page.write', description: 'Create/edit pages', category: 'pages' },
  { name: 'page.delete', description: 'Delete pages', category: 'pages' },
  
  // Role Management
  { name: 'role.read', description: 'View roles', category: 'roles' },
  { name: 'role.write', description: 'Create/edit roles', category: 'roles' },
  { name: 'role.delete', description: 'Delete roles', category: 'roles' },
  { name: 'admin.roles.view', description: 'Backend: View roles', category: 'admin' },
  
  // Hashtag Management
  { name: 'hashtag.read', description: 'View hashtags', category: 'hashtags' },
  { name: 'hashtag.write', description: 'Create/edit hashtags', category: 'hashtags' },
  { name: 'hashtag.delete', description: 'Delete hashtags', category: 'hashtags' },
  
  // Source Management
  { name: 'source.read', description: 'View sources', category: 'sources' },
  { name: 'source.write', description: 'Create/edit sources', category: 'sources' },
  { name: 'source.delete', description: 'Delete sources', category: 'sources' },
  
  // Telegram Group Management
  { name: 'telegram.read', description: 'View Telegram groups', category: 'telegram' },
  { name: 'telegram.write', description: 'Create/edit Telegram groups', category: 'telegram' },
  { name: 'telegram.delete', description: 'Delete Telegram groups', category: 'telegram' },
  
  // System Settings
  { name: 'settings.read', description: 'View system settings', category: 'settings' },
  { name: 'settings.write', description: 'Edit system settings', category: 'settings' }
];

async function setupAllPermissions() {
  console.log('🔧 Setting up all permissions...');

  // Create all permissions
  for (const perm of ALL_PERMISSIONS) {
    const created = await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description, category: perm.category },
      create: perm
    });
    console.log(`✅ ${perm.name}`);
  }

  // Assign all to superadmin role
  const superadminRole = await prisma.role.findFirst({ 
    where: { name: 'superadmin' } 
  });
  
  if (superadminRole) {
    console.log('\n🔧 Assigning all permissions to superadmin role...');
    for (const perm of ALL_PERMISSIONS) {
      const permission = await prisma.permission.findFirst({ 
        where: { name: perm.name } 
      });
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: superadminRole.id,
              permissionId: permission.id
            }
          },
          update: {},
          create: {
            roleId: superadminRole.id,
            permissionId: permission.id
          }
        });
      }
    }
    console.log('✅ All permissions assigned to superadmin');
  }

  // Assign subset to admin role
  const adminRole = await prisma.role.findFirst({ 
    where: { name: 'admin' } 
  });
  
  if (adminRole) {
    console.log('\n🔧 Assigning permissions to admin role...');
    const adminPermissions = ALL_PERMISSIONS.filter(p => 
      !p.name.includes('delete') || p.name === 'comment.delete'
    );
    
    for (const perm of adminPermissions) {
      const permission = await prisma.permission.findFirst({ 
        where: { name: perm.name } 
      });
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: adminRole.id,
              permissionId: permission.id
            }
          },
          update: {},
          create: {
            roleId: adminRole.id,
            permissionId: permission.id
          }
        });
      }
    }
    console.log('✅ Permissions assigned to admin');
  }

  console.log('\n✨ Setup complete!');
  console.log(`📊 Total permissions created: ${ALL_PERMISSIONS.length}`);
}

setupAllPermissions()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

## 🎯 Testing

After setting up permissions, verify:

1. **Check permissions exist:**
```sql
SELECT * FROM "Permission" WHERE name LIKE 'admin.roles%';
```

2. **Check role assignments:**
```sql
SELECT r.name as role, p.name as permission
FROM "RolePermission" rp
JOIN "Role" r ON rp."roleId" = r.id
JOIN "Permission" p ON rp."permissionId" = p.id
WHERE r.name IN ('admin', 'superadmin');
```

3. **Check user roles:**
```sql
SELECT u.username, r.name as role
FROM "User" u
JOIN "UserRole" ur ON u.id = ur."userId"
JOIN "Role" r ON ur."roleId" = r.id
WHERE u.id = YOUR_USER_ID;
```

## 🐛 Troubleshooting

### Still Getting 403?

1. **Clear browser cache and cookies**
2. **Logout and login again** (to refresh JWT token with new permissions)
3. **Check backend logs** for exact error message
4. **Verify permission exists** in database
5. **Verify role has permission** assigned
6. **Verify user has role** assigned

### Check Current User Permissions

Add this endpoint to your backend for debugging:

```typescript
// backend/src/controllers/user.controller.ts
public getMyPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new HttpException(401, 'Authentication required');
    }

    const permissions = await this.userService.getUserPermissions(userId);

    res.status(200).json({
      success: true,
      data: permissions,
      message: 'Permissions retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

Then check: `GET /users/me/permissions`

## 📚 Related Documentation

- [ROLES_REFACTORING_2026_01_19.md](./ROLES_REFACTORING_2026_01_19.md) - Frontend implementation
- [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) - API requirements
- Backend: `backend/src/controllers/role.controller.ts` - Role controller
- Backend: `backend/src/routes/role.route.ts` - Role routes

## ✅ Checklist

Before using the roles page, ensure:

- [ ] Permissions created in database
- [ ] Permissions assigned to roles
- [ ] User has appropriate role
- [ ] User logged out and back in (to refresh token)
- [ ] Backend is running
- [ ] API URL is correct in admin `.env`
- [ ] No CORS issues

---

**Note**: After setting up permissions, users must logout and login again to get updated permissions in their JWT token.
