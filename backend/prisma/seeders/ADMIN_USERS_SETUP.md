# Admin Users Setup

This document describes the admin users that are automatically created during database seeding.

## Admin Users

The seeding system creates three administrative users with different levels of access:

### 1. Super Administrator
- **Email:** `superadmin@eksicode.com`
- **Username:** `superadmin`
- **Role:** `superadmin`
- **Access Level:** Complete system access including system settings, user management, and all permissions

### 2. Administrator 
- **Email:** `admin@eksicode.com`
- **Username:** `admin`  
- **Role:** `admin`
- **Access Level:** Content and user management access (cannot delete users or manage system settings)

### 3. Moderator
- **Email:** `moderator@eksicode.com`
- **Username:** `moderator`
- **Role:** `moderator` 
- **Access Level:** Content moderation and limited management access

## Default Password

All admin users are created with the same default password defined in the seed configuration:
- **Password:** `eksicode2025**`

⚠️ **Security Notice:** Change these passwords immediately after initial setup in production environments.

## Roles and Permissions

### SuperAdmin Permissions
- Complete system access
- User management (create, update, delete, manage roles)
- Post management (create, update, delete, approve)
- Content moderation
- System settings management
- Permission and role management
- Media management
- Company and job management
- Page and menu management

### Admin Permissions  
- User management (create, update, view - cannot delete)
- Post management (create, update, delete, approve)
- Content moderation
- Media management (cannot delete)
- Company and job management
- Page and menu management
- Access to admin panel

### Moderator Permissions
- Post creation and approval
- Content moderation (comments)
- Category and tag management
- Access to admin panel (limited)
- View user details

### User Permissions (Regular Users)
- Create posts
- View user profiles

## Configuration

Admin users are configured in `/backend/prisma/seeders/config/seed-config.ts` in the `defaultUsers` array. 

To modify admin users:
1. Edit the `defaultUsers` configuration
2. Run database seeding: `npm run seed` or `npx prisma db seed`

## Database Relations

Each admin user is linked to their role through the `UserRole` junction table, which allows for:
- Multiple roles per user (if needed in the future)
- Role-based access control
- Permission inheritance through roles

## Security Features

- Passwords are hashed using bcrypt with configurable rounds
- Email verification status can be set
- Account verification status can be controlled
- All admin accounts are verified and email-verified by default

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

## Environment Considerations

- **Development:** Default credentials are acceptable
- **Staging:** Change passwords and use environment-specific emails  
- **Production:** Always change default passwords and use secure email addresses
