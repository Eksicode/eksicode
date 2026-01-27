# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
cd admin
npm install
```

### 2️⃣ Configure Environment
Create a `.env` file:
```bash
PUBLIC_API_URL=http://localhost:9000
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:5173**

---

## 🔐 Login

Navigate to `/login` and login with an account that has one of these roles:
- `admin`
- `superadmin`
- `moderator`

---

## 📋 What You Can Do

### Dashboard (`/`)
View real-time statistics for:
- Users, Posts, Pages
- Hashtags, Sources, Jobs, Menus
- Pending post approvals

### Management Pages

| Page | URL | Actions |
|------|-----|---------|
| **Users** | `/users` | Add, Edit, Delete users |
| **Pages** | `/pages` | Manage static pages |
| **Posts** | `/posts` | Approve/Reject posts |
| **Roles** | `/roles` | Manage roles & permissions |
| **Hashtags** | `/hashtags` | Manage hashtags |
| **Sources** | `/sources` | Manage content sources |
| **Jobs** | `/jobs` | Post job openings |
| **Menus** | `/menus` | Configure site menus |

---

## ✨ Key Features

### Every Management Page Has:
- ✅ **List View** with pagination
- ✅ **Add** new items
- ✅ **Edit** existing items
- ✅ **Delete** with confirmation
- ✅ **Toast notifications** for all actions

### UI Components:
- 📊 **Table** - Dynamic data tables
- 📄 **Modal** - Add/Edit forms
- 🔢 **Pagination** - Navigate large datasets
- 🔔 **Toast** - Success/Error notifications
- 🔘 **Button** - Consistent buttons
- 📝 **Input** - Form inputs (text, textarea, select, checkbox, etc.)

---

## 🎨 Features

- **Dark Mode Support** 🌙
- **Responsive Design** 📱
- **Turkish Language** 🇹🇷
- **Type-Safe TypeScript** 🔒
- **Loading States** ⏳
- **Error Handling** ⚠️

---

## 🛠️ Common Tasks

### Add a User
1. Go to `/users`
2. Click "Yeni Kullanıcı"
3. Fill form
4. Click "Ekle"

### Approve a Post
1. Go to `/posts`
2. Click "Görüntüle" on a post
3. Click "Onayla"

### Create a Page
1. Go to `/pages`
2. Click "Yeni Sayfa"
3. Enter title (slug auto-generates)
4. Write content
5. Check "Sayfayı yayınla"
6. Click "Ekle"

### Add a Job Posting
1. Go to `/jobs`
2. Click "Yeni İlan"
3. Fill in job details
4. Click "Ekle"

---

## 📝 Form Tips

### Auto-Generated Slugs
For Pages, Hashtags, and Menus:
- Type the name/title
- Blur the field (click outside)
- Slug auto-generates
- Or click "Slug Oluştur" button

### Required Fields
Look for the red asterisk (*) next to field labels.

### Checkboxes
- Roles: Select multiple by checking boxes
- Permissions: Scroll through list and check needed ones
- Status: Single checkbox for active/published state

---

## 🔧 Troubleshooting

### Can't see data?
- Ensure backend is running on port 9000
- Check `PUBLIC_API_URL` in `.env`
- Open browser console for errors

### Toast not showing?
- Look in top-right corner
- Auto-dismisses after 5 seconds
- Click X to close manually

### Modal stuck open?
- Press `Escape` key
- Click dark area outside modal
- Click X button in top-right

---

## 📚 More Documentation

- **USAGE_GUIDE.md** - Detailed usage instructions
- **REFACTORING_SUMMARY.md** - Technical implementation details
- **README.md** - Project overview

---

## 🎯 Production Build

```bash
npm run build      # Build for production
npm run preview    # Test production build
```

---

## 💡 Tips

1. **Loading States**: Tables and buttons show loading spinners
2. **Pagination**: Navigate with arrows or page numbers
3. **Keyboard**: Press `Escape` to close modals
4. **Dark Mode**: Follows system/browser preference
5. **Notifications**: Check top-right for toast messages

---

## 📞 Need Help?

1. Check browser console for errors
2. Verify backend API is accessible
3. Review `.env` configuration
4. Check the full USAGE_GUIDE.md

---

## 🎉 You're Ready!

Start by exploring the dashboard, then dive into managing users, posts, and other content. All pages follow the same intuitive pattern.

**Happy Managing! 🚀**
