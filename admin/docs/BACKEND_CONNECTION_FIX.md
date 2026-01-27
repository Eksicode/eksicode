# Admin Panel Backend Connection - Fixed

## Summary

Fixed the admin panel configuration to correctly connect to the backend server running on `localhost:9000`.

## Issues Found

1. **Vite Proxy** was pointing to wrong port (5000 instead of 9000)
2. **API Client** had wrong default port in production fallback
3. **Server-side layout** was inconsistent with client-side API URL pattern
4. **Documentation** referenced wrong port

## Changes Made

### 1. `vite.config.js`
- ✅ Updated proxy target from `http://localhost:5000` to `http://localhost:9000`
- ✅ Fixed rewrite rule to remove `/api` prefix (backend routes are at root level)
  - Changed: `rewrite: (path) => path.replace(/^\/api/, '/api')`
  - To: `rewrite: (path) => path.replace(/^\/api/, '')`

### 2. `src/lib/api/client.ts`
- ✅ Updated production fallback from `http://localhost:5000/api` to `http://localhost:9000/api`

### 3. `src/routes/+layout.server.ts`
- ✅ Updated default API URL from `http://localhost:9000` to `http://localhost:9000/api`
- ✅ Now consistent with client-side API URL pattern

### 4. `README.md`
- ✅ Updated example environment variable from `http://localhost:5000/api` to `http://localhost:9000/api`

## How It Works Now

### Development Mode
1. Client-side requests use `/api` prefix (e.g., `/api/auth/login`)
2. Vite dev server proxies `/api/*` to `http://localhost:9000/*`
3. Backend receives requests at root level (e.g., `/auth/login`)

### Production Mode
1. Uses `PUBLIC_API_URL` environment variable
2. Defaults to `http://localhost:9000/api` if not set
3. Server-side and client-side both use the same URL pattern

## Environment Variable

Create a `.env` file in the admin directory:

```env
PUBLIC_API_URL=http://localhost:9000/api
```

## Testing

After these changes, verify:

1. **Login works**: Client-side API call to `/api/auth/login` should reach backend
2. **Server-side auth check**: Layout server should successfully call `/api/auth/me`
3. **All API endpoints**: Should correctly proxy/connect to backend on port 9000

## Backend API Structure

The backend server:
- Runs on port **9000** (default from `backend/src/app.ts`)
- Routes are mounted at **root level** (no `/api` prefix)
- Example endpoints: `/auth/me`, `/auth/login`, `/users`, `/posts`, etc.

## Notes

- The admin panel uses `/api` prefix for consistency with the main frontend
- Vite proxy rewrites `/api` to `/` when forwarding to backend
- In production, nginx or reverse proxy should handle the `/api` prefix routing
