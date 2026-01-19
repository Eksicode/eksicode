# Admin Panel Backend Connection Analysis

## Current Configuration Issues

### Backend Server
- **Running on**: `localhost:9000`
- **API Structure**: Routes are mounted at root level (no `/api` prefix)
  - Example endpoints: `/auth/me`, `/auth/login`, `/users`, etc.
- **Port Configuration**: Backend defaults to port 9000 (from `backend/src/app.ts`)

### Admin Panel Configuration Problems

#### 1. **Vite Proxy Configuration** (`vite.config.js`)
- **Current**: Proxies `/api` to `http://localhost:5000`
- **Issue**: Wrong port (5000 instead of 9000)
- **Issue**: Proxy rewrite doesn't remove `/api` prefix (backend doesn't use `/api`)

#### 2. **API Client** (`src/lib/api/client.ts`)
- **Development**: Uses `/api` prefix (relies on vite proxy)
- **Production**: Defaults to `http://localhost:5000/api`
- **Issue**: Wrong port in production fallback
- **Issue**: Includes `/api` prefix, but backend doesn't use it

#### 3. **Server-Side Layout** (`src/routes/+layout.server.ts`)
- **Current**: Uses `http://localhost:9000` (correct port, but no `/api` prefix)
- **Issue**: Inconsistent with client-side approach
- **Issue**: Should use same pattern as client for consistency

## Recommended Fix

### Strategy
Since the backend doesn't use `/api` prefix, we have two options:

**Option A**: Keep `/api` prefix in admin panel, proxy rewrites it
- Vite proxy: `/api` → `http://localhost:9000` (rewrite removes `/api`)
- Client: Uses `/api` in dev and prod
- Server: Uses `PUBLIC_API_URL` with `/api` prefix

**Option B**: Remove `/api` prefix entirely
- Vite proxy: `/api` → `http://localhost:9000` (no rewrite needed, but then why use `/api`?)
- Client: Uses direct backend URL
- Server: Uses direct backend URL

**Recommended: Option A** - Keep `/api` prefix for consistency with frontend and easier nginx configuration.

### Required Changes

1. **Update `vite.config.js`**:
   - Change proxy target to `http://localhost:9000`
   - Add rewrite to remove `/api` prefix: `rewrite: (path) => path.replace(/^\/api/, '')`

2. **Update `src/lib/api/client.ts`**:
   - Change production fallback to `http://localhost:9000/api` (or better: use env var)

3. **Update `src/routes/+layout.server.ts`**:
   - Use `PUBLIC_API_URL` with `/api` prefix for consistency
   - Default to `http://localhost:9000/api` if env var not set

4. **Environment Variables**:
   - Set `PUBLIC_API_URL=http://localhost:9000/api` for development
   - In production, set to actual backend URL with `/api` prefix

## Current File Locations

- **Vite Config**: `/admin/vite.config.js`
- **API Client**: `/admin/src/lib/api/client.ts`
- **Server Layout**: `/admin/src/routes/+layout.server.ts`
- **Auth Store**: `/admin/src/lib/auth/store.ts`

## Testing Checklist

After fixes:
- [ ] Login works (client-side API call)
- [ ] Server-side auth check works (`/auth/me` endpoint)
- [ ] All API calls use correct backend URL
- [ ] Development proxy works correctly
- [ ] Production build uses correct API URL
