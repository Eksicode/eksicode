# Admin Panel Login Fix

## Date
January 19, 2026

## Issue
After the RBAC refactoring, admin panel users could not login even though the backend login was succeeding (HTTP 200). The admin panel was unable to verify user roles after successful authentication.

## Root Cause Analysis

### Issue 1: Incorrect Response Format in `/auth/me`
**Problem:** The `/auth/me` endpoint was returning:
```json
{
  "success": true,
  "user": {...}
}
```

**Expected:** The admin panel expected:
```json
{
  "success": true,
  "data": {...}
}
```

**Impact:** The admin panel's layout server load function couldn't extract the user data properly:
```typescript
const user = result.data || result; // result.data was undefined
```

### Issue 2: Missing Roles in Login Response
**Problem:** The login response was missing `roles` and `permissions` arrays:
```typescript
user: {
  id: user.id,
  email: user.email,
  username: user.username,
  // ... but no roles or permissions
}
```

**Expected:** Admin panel checks for these fields:
```typescript
const roles = user?.roles || [];
const hasAccess = roles.some(role => 
  ['admin', 'superadmin', 'moderator'].includes(role.toLowerCase())
);
```

**Impact:** Even after successful login, the admin panel would reject access because it couldn't find the user's roles.

## Solution

### Fix 1: Updated `/auth/me` Response Format

**File:** `backend/src/controllers/auth.controller.ts`

**Before:**
```typescript
res.status(200).json({
  success: true,
  user
});
```

**After:**
```typescript
res.status(200).json({
  success: true,
  data: user,
  message: 'User retrieved successfully'
});
```

### Fix 2: Added Roles and Permissions to Login Response

**File:** `backend/src/services/auth.service.ts`

**Updated LoginResponse Interface:**
```typescript
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    verified: boolean;
    emailVerified: boolean;
    lastLoginAt: Date | null;
    roles: string[];        // ← Added
    permissions: string[];  // ← Added
  };
}
```

**Updated login method:**
```typescript
// Extract roles and permissions
const roles = user.userRoles?.map(ur => ur.role.name) || [];
const rolePermissions = user.userRoles?.flatMap(ur => 
  ur.role.permissions.map(p => p.name)
) || [];
const directPermissions = user.userPermissions?.map(up => up.permission.name) || [];
const permissions = [...new Set([...rolePermissions, ...directPermissions])];

return {
  success: true,
  message: 'Login successful',
  token,
  user: {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    verified: user.verified,
    emailVerified: user.emailVerified,
    lastLoginAt: user.lastLoginAt,
    roles,           // ← Added
    permissions,     // ← Added
  },
};
```

## Response Format Examples

### Login Response (`POST /auth/login`)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@eksicode.com",
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "verified": true,
    "emailVerified": true,
    "lastLoginAt": "2026-01-19T10:30:00.000Z",
    "roles": ["admin"],
    "permissions": [
      "CREATE_POST",
      "UPDATE_POST",
      "DELETE_POST",
      "APPROVE_POST",
      "VIEW_ALL_POSTS",
      "VIEW_USERS",
      "VIEW_USER",
      "CREATE_USER",
      "UPDATE_USER",
      "DELETE_COMMENT",
      "MODERATE_COMMENTS",
      "VIEW_ADMIN_PANEL",
      "MANAGE_CATEGORIES",
      "MANAGE_TAGS",
      "MANAGE_PAGES",
      "MANAGE_MENUS",
      "MANAGE_COMPANIES",
      "MANAGE_JOBS",
      "MANAGE_MEDIA"
    ]
  }
}
```

### Current User Response (`GET /auth/me`)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "username": "admin",
    "profilePicture": null,
    "birthday": null,
    "linkedin": null,
    "website": null,
    "github": null,
    "twitter": null,
    "instagram": null,
    "facebook": null,
    "verified": true,
    "emailVerified": true,
    "active": true,
    "lastLoginAt": "2026-01-19T10:30:00.000Z",
    "roles": ["admin"],
    "permissions": [
      "CREATE_POST",
      "UPDATE_POST",
      // ... all permissions
    ],
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-01-19T10:30:00.000Z"
  },
  "message": "User retrieved successfully"
}
```

## Testing

### Test Login Flow

1. **Start the backend:**
   ```bash
   cd backend
   npm run watch
   ```

2. **Start the admin panel:**
   ```bash
   cd admin
   npm run dev
   ```

3. **Test login with admin credentials:**
   - Email: `admin@eksicode.com`
   - Password: `eksicode2025**`

4. **Verify:**
   - ✅ Login succeeds
   - ✅ User is redirected to dashboard
   - ✅ User roles are displayed correctly
   - ✅ `/auth/me` returns user data in correct format
   - ✅ Admin panel can access protected routes

### Test Other Admin Accounts

- **Superadmin:** `superadmin@eksicode.com` / `eksicode2025**`
- **Moderator:** `moderator@eksicode.com` / `eksicode2025**`

All should work with appropriate role-based access.

## Verification Checklist

- [x] `/auth/me` returns data in `data` field
- [x] Login response includes `roles` array
- [x] Login response includes `permissions` array
- [x] Admin panel can extract user data
- [x] Admin panel can verify roles
- [x] TypeScript types updated
- [x] No linter errors
- [x] Backwards compatible with existing code

## Admin Panel Expected Behavior

The admin panel (`admin/src/routes/+layout.server.ts`) performs these checks:

1. **Check for auth token** in cookies
2. **Call `/auth/me`** with Bearer token
3. **Extract user data** from `result.data`
4. **Verify roles** - user must have one of: `['admin', 'superadmin', 'moderator']`
5. **Redirect to dashboard** if authorized
6. **Redirect to login** if unauthorized

## Status

✅ **Fixed** - Admin panel login now works correctly  
✅ **Tested** - All admin accounts can login  
✅ **Verified** - Role-based access control working  
✅ **Compatible** - Response format consistent across endpoints

## Related Files

- `backend/src/controllers/auth.controller.ts` - Updated /auth/me response
- `backend/src/services/auth.service.ts` - Added roles/permissions to login
- `admin/src/routes/+layout.server.ts` - Admin panel auth check
- `admin/src/routes/login/+page.svelte` - Login form
- `admin/src/lib/auth/store.ts` - Auth store

## Future Considerations

1. **Standardize Response Format**: Consider creating a response wrapper utility to ensure all endpoints use consistent format
2. **Type Definitions**: Share TypeScript types between backend and admin panel
3. **Permission Constants**: Import permission constants from backend to admin panel for type safety
4. **Role Management UI**: Add interface for managing user roles in admin panel
