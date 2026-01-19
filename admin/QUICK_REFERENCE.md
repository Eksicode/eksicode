# Admin Panel v2.0 - Quick Reference Card

**Last Updated:** January 19, 2026

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit
http://localhost:5173
```

---

## 🗺️ Navigation Map

| Route | Purpose | Key Features |
|-------|---------|--------------|
| `/` | Dashboard | Stats, quick actions |
| `/settings` | **System Settings** ⭐ | 6 configuration categories |
| `/profile` | **User Profile** ⭐ | Personal info, security, preferences |
| `/users` | User Management | View, edit, delete users |
| `/posts` | Post Management | Moderate content |
| `/pages` | Page Management | Static pages |
| `/roles` | Role Management | Permissions |
| `/menus` | Menu Management | Navigation menus |
| `/hashtags` | Hashtag Management | Tags |
| `/sources` | Source Management | Content sources |
| `/jobs` | Job Management | Career listings |

⭐ = New in v2.0

---

## ⚙️ Settings Categories

### 1. General
- Site name
- Description
- URL
- Admin email

### 2. Content
- Posts per page
- Comments per page
- Guest comments
- Moderation

### 3. Security
- Email verification
- Login attempts
- Session timeout
- 2FA

### 4. Email
- SMTP config
- SSL/TLS

### 5. API
- Rate limit
- Timeout
- Docs toggle

### 6. Notifications
- Email/browser
- Digest frequency

---

## 👤 Profile Sections

### 1. Personal Info
- Avatar upload
- Name, email, bio
- Contact details

### 2. Security
- Change password
- 2FA setup
- Active sessions
- Delete account

### 3. Preferences
- Language, theme
- Timezone, date format
- Email notifications

### 4. Privacy
- Profile visibility
- Contact visibility
- Activity visibility

---

## 🎨 UI Components

### Header Dropdown
```
Click Avatar → Dropdown appears
- Profile Settings
- System Settings  
- Logout
```

### Toggle Switch
```
OFF: Gray      ON: eksiCode color
```

### Modal Pattern
```
Action Button → Modal → Confirm/Cancel
```

---

## 🔑 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close modal/dropdown |
| `Tab` | Navigate form fields |
| `Enter` | Submit form |
| `/` | Focus search (future) |

---

## 📝 Form Validation

### Email
- Must be valid format
- `name@domain.com`

### Password
- Minimum 8 characters
- Must match confirmation

### Required Fields
- Marked with `*` (or red border)
- Cannot be empty

---

## 🎯 Common Tasks

### Change Your Password
1. Avatar → Profile Settings
2. Security tab
3. "Şifre Değiştir"
4. Enter current + new password
5. Confirm

### Update Site Name
1. Avatar → System Settings
2. General tab
3. Edit "Site Adı"
4. Save

### Enable Email Notifications
1. Avatar → Profile Settings
2. Preferences tab
3. Toggle options
4. Save

### Upload Profile Picture
1. Avatar → Profile Settings
2. Personal Info tab
3. Click camera icon
4. Choose file
5. Save

---

## 🔐 Security

### Access Roles
- `superadmin` - Full access
- `admin` - Most features
- `moderator` - Limited access

### Token Expiry
- Default: 24 hours
- Configurable in settings

### Password Rules
- Min 8 characters
- Current password required to change

---

## 🐛 Troubleshooting

### Can't Save Settings
✅ Check network connection  
✅ Verify you're logged in  
✅ Check browser console

### Dropdown Won't Close
✅ Click outside  
✅ Press Escape  
✅ Refresh page

### Picture Won't Upload
✅ Max 5MB  
✅ JPEG, PNG, GIF, WebP only  
✅ Try different image

### Dark Mode Issues
✅ Clear localStorage  
✅ Check theme setting  
✅ Refresh browser

---

## 🌙 Theme Options

| Theme | Behavior |
|-------|----------|
| `auto` | Follows system |
| `light` | Always light |
| `dark` | Always dark |

---

## 💾 Data Storage

### localStorage Keys
```javascript
'auth_token'      // JWT token
'admin_settings'  // Settings cache
'theme'          // Theme preference
```

### Clear Cache
```javascript
// Browser Console
localStorage.clear()
```

---

## 🔌 API Endpoints

### Settings
```
GET    /settings
PUT    /settings/:key
POST   /settings
```

### Profile
```
GET    /auth/me
PUT    /users/profile
PUT    /users/preferences
PUT    /users/privacy
POST   /auth/change-password
```

### Upload
```
POST   /upload/avatar
```

---

## 📱 Responsive Breakpoints

| Size | Width | Layout |
|------|-------|--------|
| Mobile | < 768px | Single column |
| Tablet | 768-1023px | Two columns |
| Desktop | ≥ 1024px | Full layout |

---

## 🎨 Color Palette

```
Primary (eksiCode):  #YOUR_BRAND_COLOR
Success:             #10B981 (green)
Error:               #EF4444 (red)
Warning:             #F59E0B (yellow)
Info:                #3B82F6 (blue)
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Getting started |
| `FEATURE_GUIDE.md` | Feature walkthroughs |
| `API_INTEGRATION_GUIDE.md` | Backend specs |
| `ADMIN_REFACTORING_2026.md` | Technical details |
| `CHANGELOG.md` | Version history |
| `QUICK_REFERENCE.md` | This file |

---

## 🆘 Get Help

1. Check documentation
2. Review troubleshooting
3. Check browser console
4. Contact dev team

---

## 📊 Status Indicators

```
✅ Complete
⏳ In Progress
❌ Error
⚠️ Warning
ℹ️ Info
```

---

## 🔢 Version Info

**Current Version:** 2.0.0  
**Release Date:** January 19, 2026  
**Status:** Production Ready (Frontend)

---

## 🎯 Quick Links

- **Dashboard:** `/`
- **Settings:** `/settings`
- **Profile:** `/profile`
- **Logout:** Click avatar → Logout

---

## 💡 Pro Tips

1. **Use keyboard shortcuts** for faster navigation
2. **Save often** when making changes
3. **Test in dark mode** if you prefer it
4. **Check notifications** regularly
5. **Keep your profile updated**
6. **Use strong passwords**
7. **Review privacy settings** periodically
8. **Export settings** before major changes

---

## 🚨 Emergency Actions

### Lost Password
- Contact superadmin
- Check email for reset

### Account Locked
- Wait for timeout
- Contact superadmin

### Data Loss
- Check localStorage
- Reload page
- Re-enter data

---

## 📞 Support Contacts

**Technical Issues:** Dev Team  
**Account Issues:** Superadmin  
**Feature Requests:** Product Team  
**Bug Reports:** QA Team

---

**Print this page for quick reference!** 🖨️

---

*Admin Panel v2.0 - Built with ❤️ using SvelteKit*
