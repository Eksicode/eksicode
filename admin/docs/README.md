# Admin Panel

SvelteKit-based admin panel for managing the Eksicode platform.

## ✨ Features

### Core Features
- 🔐 Role-based access control (admin, superadmin, moderator)
- 🎫 JWT token authentication
- 🛡️ Server-side route protection
- 🎨 Modern UI with TailwindCSS
- 🌙 Dark mode support

### New Features (v2.0.0)
- ⚙️ **System Settings Panel** - Comprehensive configuration management
  - General, Content, Security, Email, API, and Notification settings
  - Tabbed interface for organized settings
  - Real-time save feedback
- 👤 **User Profile Management** - Complete profile and account settings
  - Personal information with profile picture upload
  - Security settings with password change
  - Preferences (language, theme, timezone, notifications)
  - Privacy controls
- 🎯 **Enhanced Header** - Profile dropdown with avatar and quick access
- 📊 **Improved Dashboard** - Statistics and quick actions
- 🎨 **Better UX** - Smooth animations, responsive design, and intuitive navigation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the admin directory:

```bash
# .env
PUBLIC_API_URL=http://localhost:9000
```

For production:
```bash
# .env.production
PUBLIC_API_URL=https://api.yourdomain.com
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
admin/
├── src/
│   ├── lib/
│   │   ├── api/           # API client and utilities
│   │   ├── auth/          # Authentication store and utilities
│   │   ├── components/    # Reusable components
│   │   │   ├── layout/   # Layout components (Header, Sidebar)
│   │   │   └── ui/       # UI components (Button, Input, Modal, etc.)
│   │   ├── stores/        # State management
│   │   │   ├── settings.ts  # Settings store
│   │   │   └── theme.ts     # Theme store
│   │   └── utils/         # Utility functions
│   └── routes/            # SvelteKit routes
│       ├── settings/      # System settings page
│       ├── profile/       # User profile page
│       ├── users/         # User management
│       ├── posts/         # Post management
│       └── ...           # Other management pages
├── static/                # Static assets
└── package.json
```

## Authentication

The admin panel uses JWT token-based authentication. Only users with `admin`, `superadmin`, or `moderator` roles can access the panel.

## API Integration

The admin panel connects to the backend API using the same endpoints as the main frontend. All API calls require authentication via Bearer token.

### New API Endpoints Required

For full functionality of Settings and Profile features, implement these endpoints:

**Settings:**
- `GET /settings` - Get all settings
- `PUT /settings/:key` - Update setting
- `POST /settings` - Create setting

**Profile:**
- `GET /auth/me` - Get current user (extended with preferences and privacy)
- `PUT /users/profile` - Update profile
- `PUT /users/preferences` - Update preferences
- `PUT /users/privacy` - Update privacy settings
- `POST /auth/change-password` - Change password
- `DELETE /users/account` - Delete account

**File Upload:**
- `POST /upload/avatar` - Upload profile picture

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for detailed API specifications.

## 📚 Documentation

- **[ADMIN_REFACTORING_2026.md](./ADMIN_REFACTORING_2026.md)** - Complete refactoring summary
- **[FEATURE_GUIDE.md](./FEATURE_GUIDE.md)** - Visual feature guide and usage
- **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - Backend API integration guide
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide
- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - Detailed usage instructions
- **[FEATURES_OVERVIEW.md](./FEATURES_OVERVIEW.md)** - Complete features list

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp sample.env .env
   # Edit .env with your API URL
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:5173` and login with admin credentials

## 🎯 Key Pages

- **Dashboard** (`/`) - Overview and statistics
- **Settings** (`/settings`) - System configuration
- **Profile** (`/profile`) - User account management
- **Users** (`/users`) - User management
- **Posts** (`/posts`) - Content moderation
- **Pages** (`/pages`) - Static page management
- **Roles** (`/roles`) - Role and permission management

## 🌟 What's New in v2.0.0

- ⚙️ Comprehensive system settings panel with 6 categories
- 👤 Full-featured user profile management
- 🎨 Enhanced header with profile dropdown
- 🔒 Security improvements (password change, 2FA ready)
- 🎨 Better UX with smooth animations
- 📱 Fully responsive design
- 🌙 Improved dark mode support
- 💾 Client-side settings persistence

## License

ISC
