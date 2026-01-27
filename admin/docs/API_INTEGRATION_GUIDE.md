# Admin Panel - API Integration Guide

## 🔌 Backend API Requirements

This guide outlines the API endpoints required to support the new Settings and Profile features in the Admin Panel.

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Settings Endpoints](#settings-endpoints)
3. [Profile Endpoints](#profile-endpoints)
4. [File Upload](#file-upload)
5. [Response Formats](#response-formats)
6. [Error Handling](#error-handling)

---

## 🔐 Authentication

All endpoints require JWT authentication via Bearer token:

```http
Authorization: Bearer <jwt_token>
```

**Role Requirements:**
- Settings endpoints: `admin`, `superadmin`
- Profile endpoints: `admin`, `superadmin`, `moderator`

---

## ⚙️ Settings Endpoints

### Get All Settings

```http
GET /settings
```

**Query Parameters:**
- `summaryOnly`: boolean (optional) - Return only setting keys and values

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "key": "siteName",
      "value": "EksiCode",
      "category": "general",
      "type": "string",
      "updatedAt": "2026-01-19T10:00:00Z"
    },
    {
      "key": "postsPerPage",
      "value": 20,
      "category": "content",
      "type": "number",
      "updatedAt": "2026-01-19T10:00:00Z"
    }
  ],
  "message": "Settings retrieved successfully"
}
```

### Get Setting by Key

```http
GET /settings/:key
```

**Response:**
```json
{
  "success": true,
  "data": {
    "key": "siteName",
    "value": "EksiCode",
    "category": "general",
    "type": "string",
    "description": "The name of the website",
    "updatedAt": "2026-01-19T10:00:00Z"
  },
  "message": "Setting retrieved successfully"
}
```

### Create Setting

```http
POST /settings
```

**Request Body:**
```json
{
  "key": "newSetting",
  "value": "some value",
  "category": "general",
  "type": "string",
  "description": "Description of the setting"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "key": "newSetting",
    "value": "some value",
    "category": "general",
    "type": "string",
    "createdAt": "2026-01-19T10:00:00Z"
  },
  "message": "Setting created successfully"
}
```

### Update Setting

```http
PUT /settings/:key
```

**Request Body:**
```json
{
  "value": "updated value",
  "category": "general"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "key": "siteName",
    "value": "updated value",
    "category": "general",
    "updatedAt": "2026-01-19T10:00:00Z"
  },
  "message": "Setting updated successfully"
}
```

### Delete Setting

```http
DELETE /settings/:key
```

**Response:**
```json
{
  "success": true,
  "message": "Setting deleted successfully"
}
```

---

## 👤 Profile Endpoints

### Get Current User Profile

```http
GET /auth/me
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "username": "admin",
    "email": "admin@eksicode.com",
    "firstName": "Admin",
    "lastName": "User",
    "bio": "System administrator",
    "phone": "+90 555 555 5555",
    "location": "Istanbul, Turkey",
    "website": "https://example.com",
    "profilePicture": "https://cdn.eksicode.com/avatars/admin.jpg",
    "roles": ["admin", "moderator"],
    "permissions": ["read", "write", "delete"],
    "verified": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-01-19T10:00:00Z",
    "preferences": {
      "language": "tr",
      "timezone": "Europe/Istanbul",
      "dateFormat": "DD/MM/YYYY",
      "theme": "auto",
      "emailOnComment": true,
      "emailOnReply": true,
      "emailOnMention": true,
      "emailNewsletter": false
    },
    "privacy": {
      "profileVisible": true,
      "showEmail": false,
      "showLocation": false,
      "allowMessages": true,
      "activityVisible": true
    }
  },
  "message": "Profile retrieved successfully"
}
```

### Update Profile

```http
PUT /users/profile
```

**Request Body:**
```json
{
  "email": "newemail@eksicode.com",
  "firstName": "New",
  "lastName": "Name",
  "bio": "Updated bio",
  "phone": "+90 555 555 5555",
  "location": "Ankara, Turkey",
  "website": "https://newsite.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "username": "admin",
    "email": "newemail@eksicode.com",
    "firstName": "New",
    "lastName": "Name",
    "bio": "Updated bio",
    "updatedAt": "2026-01-19T10:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

### Update User Preferences

```http
PUT /users/preferences
```

**Request Body:**
```json
{
  "language": "en",
  "timezone": "Europe/London",
  "theme": "dark",
  "emailOnComment": false,
  "emailOnReply": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "language": "en",
      "timezone": "Europe/London",
      "dateFormat": "DD/MM/YYYY",
      "theme": "dark",
      "emailOnComment": false,
      "emailOnReply": true,
      "emailOnMention": true,
      "emailNewsletter": false
    }
  },
  "message": "Preferences updated successfully"
}
```

### Update Privacy Settings

```http
PUT /users/privacy
```

**Request Body:**
```json
{
  "profileVisible": true,
  "showEmail": false,
  "showLocation": false,
  "allowMessages": true,
  "activityVisible": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "privacy": {
      "profileVisible": true,
      "showEmail": false,
      "showLocation": false,
      "allowMessages": true,
      "activityVisible": false
    }
  },
  "message": "Privacy settings updated successfully"
}
```

### Change Password

```http
POST /auth/change-password
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Current password is incorrect",
  "errors": ["Invalid current password"]
}
```

### Delete Account

```http
DELETE /users/account
```

**Request Body (optional):**
```json
{
  "password": "userpassword123",
  "reason": "No longer need the account"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 📤 File Upload

### Upload Profile Picture

```http
POST /upload/avatar
```

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `avatar`
- Max file size: 5MB
- Allowed types: JPEG, PNG, GIF, WebP

**Request (multipart/form-data):**
```
--boundary
Content-Disposition: form-data; name="avatar"; filename="profile.jpg"
Content-Type: image/jpeg

<binary data>
--boundary--
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.eksicode.com/avatars/user-123-1642584000.jpg",
    "filename": "profile.jpg",
    "size": 245678,
    "mimeType": "image/jpeg"
  },
  "message": "Avatar uploaded successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "File too large",
  "errors": ["Maximum file size is 5MB"]
}
```

---

## 📊 Response Formats

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    "Detailed error 1",
    "Detailed error 2"
  ]
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  },
  "message": "Data retrieved successfully"
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Unprocessable Entity (validation failed)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Common Error Responses

#### Unauthorized

```json
{
  "success": false,
  "message": "Authentication required",
  "errors": ["No valid token provided"]
}
```

#### Forbidden

```json
{
  "success": false,
  "message": "Access denied",
  "errors": ["Insufficient permissions"]
}
```

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 8 characters"
  ]
}
```

#### Rate Limit

```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "errors": ["Too many requests. Please try again later."],
  "retryAfter": 60
}
```

---

## 🔒 Security Considerations

### Password Requirements

```javascript
{
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: false
}
```

### Token Validation

- Verify JWT signature
- Check expiration
- Validate user roles
- Check if token is blacklisted

### Input Validation

```javascript
// Example validation rules
{
  email: {
    required: true,
    format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128
  }
}
```

### Rate Limiting

Recommended limits:
- General API: 100 requests/minute
- Login attempts: 5 requests/15 minutes
- Password change: 3 requests/hour
- File uploads: 10 requests/hour

---

## 🧪 Example Requests

### cURL Examples

#### Get Settings

```bash
curl -X GET "https://api.eksicode.com/settings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Update Profile

```bash
curl -X PUT "https://api.eksicode.com/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Software developer"
  }'
```

#### Change Password

```bash
curl -X POST "https://api.eksicode.com/auth/change-password" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpass123",
    "newPassword": "newpass456"
  }'
```

#### Upload Avatar

```bash
curl -X POST "https://api.eksicode.com/upload/avatar" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@/path/to/profile.jpg"
```

### JavaScript/Fetch Examples

#### Get Settings

```javascript
const response = await fetch('https://api.eksicode.com/settings', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

#### Update Preferences

```javascript
const response = await fetch('https://api.eksicode.com/users/preferences', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    theme: 'dark',
    language: 'en',
    emailOnComment: true
  })
});

const data = await response.json();
```

---

## 📝 Database Schema Suggestions

### Settings Table

```sql
CREATE TABLE settings (
  id VARCHAR(36) PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL, -- string, number, boolean, json
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_key (key)
);
```

### User Extensions

```sql
-- Add to existing users table
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN location VARCHAR(255);
ALTER TABLE users ADD COLUMN website VARCHAR(255);
ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255);

-- User preferences table
CREATE TABLE user_preferences (
  user_id VARCHAR(36) PRIMARY KEY,
  language VARCHAR(10) DEFAULT 'tr',
  timezone VARCHAR(50) DEFAULT 'Europe/Istanbul',
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  theme VARCHAR(10) DEFAULT 'auto',
  email_on_comment BOOLEAN DEFAULT TRUE,
  email_on_reply BOOLEAN DEFAULT TRUE,
  email_on_mention BOOLEAN DEFAULT TRUE,
  email_newsletter BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User privacy settings table
CREATE TABLE user_privacy (
  user_id VARCHAR(36) PRIMARY KEY,
  profile_visible BOOLEAN DEFAULT TRUE,
  show_email BOOLEAN DEFAULT FALSE,
  show_location BOOLEAN DEFAULT FALSE,
  allow_messages BOOLEAN DEFAULT TRUE,
  activity_visible BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🚀 Implementation Checklist

Backend implementation checklist:

- [ ] Settings endpoints
  - [ ] GET /settings
  - [ ] GET /settings/:key
  - [ ] POST /settings
  - [ ] PUT /settings/:key
  - [ ] DELETE /settings/:key
  
- [ ] Profile endpoints
  - [ ] GET /auth/me (update to include preferences and privacy)
  - [ ] PUT /users/profile
  - [ ] PUT /users/preferences
  - [ ] PUT /users/privacy
  - [ ] POST /auth/change-password
  - [ ] DELETE /users/account
  
- [ ] File upload
  - [ ] POST /upload/avatar
  - [ ] Image processing (resize, crop)
  - [ ] CDN integration
  
- [ ] Security
  - [ ] JWT validation middleware
  - [ ] Role-based access control
  - [ ] Rate limiting
  - [ ] Input validation
  - [ ] SQL injection prevention
  - [ ] XSS prevention
  
- [ ] Database
  - [ ] Settings table
  - [ ] User preferences table
  - [ ] User privacy table
  - [ ] Indexes for performance
  
- [ ] Testing
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] API endpoint tests
  - [ ] Security tests

---

## 📞 Support

For questions or issues with API integration:
- Check the main documentation: `ADMIN_REFACTORING_2026.md`
- Review the feature guide: `FEATURE_GUIDE.md`
- Contact the frontend development team

---

**Last Updated:** January 19, 2026  
**API Version:** 2.0.0
