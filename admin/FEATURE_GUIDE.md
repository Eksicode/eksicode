# Admin Panel - Feature Guide

## 🎨 New Features Overview

### 1. Enhanced Header with Profile Dropdown

The header now includes a sophisticated profile dropdown with:

```
┌─────────────────────────────────────────────────────────┐
│  Dashboard                         [Avatar] Username ▼  │
│                                           Admin          │
└─────────────────────────────────────────────────────────┘
                                            │
                        ┌───────────────────┴──────────────┐
                        │  Username                        │
                        │  email@example.com               │
                        ├──────────────────────────────────┤
                        │  👤 Profil Ayarları              │
                        │  ⚙️  Sistem Ayarları             │
                        ├──────────────────────────────────┤
                        │  🚪 Çıkış Yap                    │
                        └──────────────────────────────────┘
```

**Features:**
- Profile picture display (or initials fallback)
- User info preview
- Quick access to profile and settings
- Smooth dropdown animation
- Click-outside to close

### 2. System Settings Panel (`/settings`)

A comprehensive multi-tab settings interface:

```
┌──────────────────────────────────────────────────────────┐
│  Sistem Ayarları                                         │
│  Uygulama genelindeki ayarları yönetin                  │
├──────────────────────────────────────────────────────────┤
│  [Genel] [İçerik] [Güvenlik] [E-posta] [API] [Bildirim]│
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Genel Ayarlar                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Site Adı:     [EksiCode                    ]    │   │
│  │ Site Açıklaması: [Yazılım Geliştirme...   ]    │   │
│  │ Site URL:     [https://eksicode.com        ]    │   │
│  │ Admin E-posta:[admin@eksicode.com          ]    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│                              [Ayarları Kaydet]          │
└──────────────────────────────────────────────────────────┘
```

#### Tab Breakdown

**🏠 Genel (General)**
- Site name, description, URL
- Admin email
- Basic configuration

**📄 İçerik (Content)**
- Posts per page (1-100)
- Comments per page (1-100)
- Guest comments toggle
- Moderation requirements

**🔒 Güvenlik (Security)**
- Email verification toggle
- Max login attempts (3-10)
- Session timeout (300-86400 seconds)
- Two-factor authentication

**📧 E-posta (Email)**
- SMTP host and port
- Email credentials
- Sender email
- SSL/TLS security

**🔌 API**
- Rate limit (10-1000 req/min)
- Timeout (1000-60000 ms)
- API documentation toggle

**🔔 Bildirimler (Notifications)**
- Email notifications toggle
- Browser notifications toggle
- Digest frequency (realtime/hourly/daily/weekly/never)

### 3. User Profile Panel (`/profile`)

A complete profile management system:

```
┌──────────────────────────────────────────────────────────┐
│  Profil Ayarları                                         │
│  Kişisel bilgilerinizi ve hesap ayarlarınızı yönetin   │
├──────────────────────────────────────────────────────────┤
│  [Kişisel Bilgiler] [Güvenlik] [Tercihler] [Gizlilik]  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────┐                                                 │
│  │ 👤 │  username                                       │
│  │ 📷 │  email@example.com                             │
│  └────┘  Roller: admin, moderator                      │
│                                                          │
│  ┌──────────────────┬──────────────────┐              │
│  │ Kullanıcı Adı    │ E-posta          │              │
│  │ [username    ]   │ [email@...   ]   │              │
│  ├──────────────────┼──────────────────┤              │
│  │ Ad               │ Soyad            │              │
│  │ [Adınız      ]   │ [Soyadınız   ]   │              │
│  └──────────────────┴──────────────────┘              │
│                                                          │
│  Biyografi:                                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Kendinizden bahsedin...                         │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│                              [Profili Kaydet]           │
└──────────────────────────────────────────────────────────┘
```

#### Tab Breakdown

**👤 Kişisel Bilgiler (Personal Info)**
- Profile picture with upload
- Username (read-only)
- Email, First name, Last name
- Phone, Location
- Website URL
- Biography

**🔒 Güvenlik (Security)**
- Password change with modal
- Two-factor authentication setup
- Active sessions viewer
- Danger zone: Account deletion

**⚙️ Tercihler (Preferences)**
- Language (Turkish, English)
- Theme (auto, light, dark)
- Timezone
- Date format
- Email notification preferences:
  - Comments
  - Replies
  - Mentions
  - Newsletter

**🔐 Gizlilik (Privacy)**
- Profile visibility
- Email address visibility
- Location visibility
- Allow direct messages
- Activity history visibility

### 4. Updated Sidebar

```
┌──────────────────────┐
│  📊 Dashboard        │
│  📄 Sayfalar         │
│  👥 Kullanıcılar     │
│  📝 Posts            │
│  🎭 Roller           │
│  🍔 Menüler          │
│  🏷️  Etiketler       │
│  📚 Kaynaklar        │
│  💼 Kariyer          │
│  ⚙️  Ayarlar         │
├──────────────────────┤
│  👤 Profil           │
└──────────────────────┘
```

**New:** Profile link at bottom with visual separator

## 🎯 Common Use Cases

### Changing Your Password

1. Click your avatar in the header
2. Select **"Profil Ayarları"**
3. Go to **"Güvenlik"** tab
4. Click **"Şifre Değiştir"**
5. Enter current password
6. Enter new password (min 8 chars)
7. Confirm new password
8. Click **"Şifreyi Değiştir"**

### Updating Site Name

1. Click your avatar in the header
2. Select **"Sistem Ayarları"**
3. Stay on **"Genel"** tab
4. Update **"Site Adı"** field
5. Click **"Ayarları Kaydet"**

### Configuring Email Notifications

1. Go to **Profile → Tercihler**
2. Scroll to **"E-posta Bildirimleri"** section
3. Toggle switches for:
   - Comments on your posts
   - Replies to your comments
   - When you're mentioned
   - Newsletter subscription
4. Click **"Tercihleri Kaydet"**

### Setting Up Content Moderation

1. Go to **Settings → İçerik**
2. Toggle **"Moderasyon Gerekli"**
3. Adjust posts/comments per page
4. Configure guest comments
5. Click **"Ayarları Kaydet"**

### Managing Privacy Settings

1. Go to **Profile → Gizlilik**
2. Toggle visibility options:
   - Profile visibility
   - Email visibility
   - Location visibility
   - Direct messages
   - Activity history
3. Click **"Gizlilik Ayarlarını Kaydet"**

## 🎨 Visual Elements

### Profile Picture Upload

```
Current Picture          Upload New
┌──────────┐            ┌──────────┐
│          │            │    📷    │
│    👤    │  ───────>  │  Choose  │
│          │            │   File   │
└──────────┘            └──────────┘
```

**Supports:**
- JPEG, PNG, GIF, WebP
- Instant preview
- Circular crop display
- Fallback to initials if no image

### Toggle Switches

```
OFF                      ON
┌─────○──┐              ┌──○─────┐
│        │              │        │
└────────┘              └────────┘
  Gray                   eksiCode Color
```

**Used for:**
- Boolean settings
- Privacy controls
- Feature toggles

### Modal Dialogs

```
┌─────────────────────────────────┐
│  Şifre Değiştir            [×]  │
├─────────────────────────────────┤
│                                 │
│  Mevcut Şifre:                 │
│  [••••••••••••]                │
│                                 │
│  Yeni Şifre:                   │
│  [••••••••••••]                │
│                                 │
│  Yeni Şifre (Tekrar):          │
│  [••••••••••••]                │
│                                 │
│         [İptal] [Şifreyi Değiştir]│
└─────────────────────────────────┘
```

**Features:**
- Backdrop overlay
- Click outside to close
- Escape key support
- Action buttons

## 🚦 Status Indicators

### Save Messages

**Success:**
```
┌─────────────────────────────────────────┐
│ ✓ Ayarlar başarıyla kaydedildi!        │
└─────────────────────────────────────────┘
Green background
```

**Error:**
```
┌─────────────────────────────────────────┐
│ ✗ Ayarlar kaydedilirken bir hata oluştu!│
└─────────────────────────────────────────┘
Red background
```

### Loading States

```
[Kaydediliyor...] ⟳
```

Buttons show spinner and disabled state during operations.

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Full sidebar visible
- Multi-column grids
- Expanded header with all info

### Tablet (768px - 1023px)
- Collapsible sidebar
- Two-column grids
- Compact header

### Mobile (<768px)
- Hidden sidebar (hamburger menu)
- Single column layout
- Minimal header (avatar only)

## 🌙 Dark Mode Support

All components support dark mode:

```
Light Mode              Dark Mode
┌────────────┐         ┌────────────┐
│ ☀️ White   │         │ 🌙 Dark    │
│  bg-white  │         │ bg-DarkerGrey│
│  Gray text │         │ White text │
└────────────┘         └────────────┘
```

Toggle automatically based on:
- System preference (auto)
- Manual selection (light/dark)
- Persisted in localStorage

## 🔐 Security Features

### Password Requirements
- ✓ Minimum 8 characters
- ✓ Current password verification
- ✓ Confirmation match required

### Account Deletion
```
┌──────────────────────────────────────┐
│  ⚠️  Hesabı Sil                      │
├──────────────────────────────────────┤
│  Bu işlem GERİ ALINAMAZ!            │
│  Tüm verileriniz kalıcı silinecek   │
│                                      │
│  [İptal] [Evet, Hesabı Sil]        │
└──────────────────────────────────────┘
Double confirmation required
```

### Session Management
- Automatic timeout
- Configurable duration
- Token-based authentication
- Secure logout

## 💡 Tips & Best Practices

1. **Profile Picture:** Use square images for best results (min 200x200px)
2. **Email Settings:** Test SMTP settings before saving
3. **Password:** Use strong passwords with mix of characters
4. **Backups:** Regularly export your settings
5. **Privacy:** Review privacy settings periodically
6. **Notifications:** Adjust to prevent email overload
7. **Theme:** Use 'auto' to match system preference
8. **Sessions:** Set reasonable timeout for security

## 🆘 Troubleshooting

### Profile Picture Not Uploading
- Check file size (max 5MB recommended)
- Ensure correct format (JPEG, PNG, GIF, WebP)
- Try different image

### Settings Not Saving
- Check network connection
- Verify authentication token
- Check browser console for errors
- Try refreshing the page

### Dropdown Not Opening
- Check if JavaScript is enabled
- Clear browser cache
- Try different browser
- Check console for errors

### Dark Mode Not Working
- Clear localStorage
- Check system preferences
- Try manual theme selection
- Refresh the page

---

## 📞 Need Help?

For additional support or questions:
- Check the full documentation in `ADMIN_REFACTORING_2026.md`
- Review the usage guide in `USAGE_GUIDE.md`
- Contact the development team

---

**Last Updated:** January 19, 2026  
**Version:** 2.0.0
