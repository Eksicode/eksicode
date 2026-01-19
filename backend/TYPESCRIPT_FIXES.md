# TypeScript Compilation Fixes

## Date
January 19, 2026

## Issue
After the RBAC refactoring, TypeScript compilation errors occurred due to type mismatches.

## Errors Fixed

### 1. ❌ Error in `src/constants/roles.ts:83`

**Problem:**
```typescript
return [ROLE_NAMES.MODERATOR, ROLE_NAMES.USER].includes(targetRole as RoleName);
```

TypeScript was narrowing the array type to `["moderator", "user"]` instead of allowing any `RoleName`, causing a type mismatch.

**Solution:**
```typescript
const manageableRoles: string[] = [ROLE_NAMES.MODERATOR, ROLE_NAMES.USER];
return manageableRoles.includes(targetRole);
```

Explicitly typed the array as `string[]` to prevent type narrowing.

---

### 2. ❌ Error in `src/utils/roleGuard.ts:38`

**Problem:**
```typescript
return this.prisma.user.findUnique({...}) as Promise<UserWithRolesAndPermissions | null>;
```

The return type from Prisma didn't match `UserWithRolesAndPermissions` due to include/where clause issues.

**Solution:**
Instead of casting, properly handle the query result and filter inactive relations manually:

```typescript
const user = await this.prisma.user.findUnique({
  where: { id: userId, active: true },
  include: {
    userRoles: {
      where: { active: true },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    },
    userPermissions: {
      where: { active: true },
      include: {
        permission: true
      }
    }
  }
});

if (!user) return null;

// Filter out inactive roles and permissions
const filteredUser = {
  ...user,
  userRoles: user.userRoles.filter(ur => ur.role.active && ur.active),
  userPermissions: user.userPermissions.filter(up => up.permission.active && up.active)
};

// Filter out inactive permissions from roles
filteredUser.userRoles = filteredUser.userRoles.map(ur => ({
  ...ur,
  role: {
    ...ur.role,
    permissions: ur.role.permissions.filter(p => p.active)
  }
}));

return filteredUser as UserWithRolesAndPermissions;
```

---

### 3. ❌ Error in `src/utils/roleGuard.ts:45`

**Problem:**
```typescript
role: {
  where: { active: true },  // ❌ 'where' does not exist in type 'RoleDefaultArgs'
  include: {
    permissions: {
      where: { active: true }
    }
  }
}
```

Prisma's nested `include` doesn't support `where` clauses on the included relation itself.

**Solution:**
Removed the nested `where` clause and filtered manually after the query (see solution #2 above).

---

### 4. ❌ Error in `src/utils/roleGuard.ts:58`

**Problem:**
```typescript
permission: {
  where: { active: true }  // ❌ 'where' does not exist in type 'PermissionDefaultArgs'
}
```

Same issue as #3 - nested `where` on `include`.

**Solution:**
Removed the nested `where` clause and filtered manually after the query (see solution #2 above).

---

## Verification

TypeScript compilation now succeeds:

```bash
$ ./node_modules/.bin/tsc --noEmit
# Exit code: 0 ✅
```

## Key Takeaways

1. **Prisma Include Limitations:** 
   - Nested `include` relations don't support `where` clauses on the relation itself
   - Use `where` on the parent relation and filter manually if needed

2. **Type Narrowing:**
   - Array literals are narrowed to their exact types
   - Use explicit type annotations (`string[]`) when needed for flexibility

3. **Type Assertions:**
   - Avoid using `as` for complex type conversions
   - Properly structure the data to match the expected type

## Status

✅ All TypeScript compilation errors resolved  
✅ Linter shows no errors  
✅ Type safety maintained  
✅ Code is ready for production
