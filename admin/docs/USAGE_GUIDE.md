# Admin Panel Usage Guide

## Getting Started

### 1. Installation
```bash
cd admin
npm install
```

### 2. Configuration
Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PUBLIC_API_URL=http://localhost:9000
```

### 3. Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## Login

1. Navigate to `/login`
2. Enter your credentials
3. Must have one of these roles:
   - `admin`
   - `superadmin`
   - `moderator`

---

## Dashboard

The dashboard displays real-time statistics:

### Statistics Cards
- **Toplam Kullanıcı**: Total registered users
- **Toplam Gönderi**: Total posts in system
- **Bekleyen Onay**: Posts awaiting approval
- **Toplam Sayfa**: Static pages
- **Toplam Etiket**: Hashtags
- **Toplam Kaynak**: Sources
- **Kariyer İlanı**: Job postings
- **Menü Öğesi**: Menu items

Click any card to navigate to that section.

---

## User Management (`/users`)

### List Users
- View all users in paginated table
- See username, email, name, roles, and verification status
- Navigate between pages

### Add User
1. Click "Yeni Kullanıcı" button
2. Fill in the form:
   - Username (required)
   - Email (required)
   - Password (required)
   - First Name
   - Last Name
   - Roles (check multiple)
   - Email verified status
3. Click "Ekle"

### Edit User
1. Click "Düzenle" on any user row
2. Modify fields
3. Password is optional (leave blank to keep current)
4. Click "Güncelle"

### Delete User
1. Click "Sil" on any user row
2. Confirm deletion in modal
3. Click "Sil" to confirm

---

## Page Management (`/pages`)

### Add Page
1. Click "Yeni Sayfa"
2. Enter title
3. Slug auto-generates (or click "Slug Oluştur")
4. Write content
5. Add meta description (optional, for SEO)
6. Check "Sayfayı yayınla" to publish immediately
7. Click "Ekle"

### Edit Page
1. Click "Düzenle" on any page
2. Modify fields
3. Click "Güncelle"

### Delete Page
1. Click "Sil"
2. Confirm deletion

**Tips:**
- Slug is URL-friendly version of title
- Use meta description for SEO
- Unpublished pages are hidden from public

---

## Post Management (`/posts`)

### View Post
1. Click "Görüntüle" to see full post details
2. View title, content, source, hashtags
3. Approve or Reject from detail view

### Quick Actions
- **Onayla**: Approve a pending post
- **Reddet**: Reject a pending post

### Add/Edit Post
1. Click "Yeni Gönderi" or "Düzenle"
2. Enter title and content
3. Add source URL (optional)
4. Select status:
   - `pending`: Awaiting approval
   - `approved`: Published
   - `rejected`: Rejected
5. Click "Ekle" or "Güncelle"

---

## Role Management (`/roles`)

### Understanding Permissions
Permissions follow `resource.action` format:
- `user.read`: View users
- `user.write`: Create/edit users
- `user.delete`: Delete users
- `post.approve`: Approve posts
- etc.

### Add Role
1. Click "Yeni Rol"
2. Enter role name (e.g., "editor", "contributor")
3. Add description
4. Check permissions you want to grant
5. Click "Ekle"

### Edit Role
1. Click "Düzenle"
2. Modify name, description, or permissions
3. Click "Güncelle"

**Tip:** Use descriptive names and clear descriptions for roles

---

## Hashtag Management (`/hashtags`)

### Add Hashtag
1. Click "Yeni Etiket"
2. Enter name (e.g., "javascript", "python")
3. Slug auto-generates from name
4. Add description (optional)
5. Check "Etiketi aktif et"
6. Click "Ekle"

### Edit Hashtag
- Modify name, slug, description, or active status

### Delete Hashtag
- Posts with this hashtag won't be deleted, just unlinked

**Note:** Inactive hashtags won't appear in public lists

---

## Source Management (`/sources`)

### Add Source
1. Click "Yeni Kaynak"
2. Enter source name (e.g., "GitHub", "Stack Overflow")
3. Enter source URL (must be valid URL)
4. Add description
5. Check "Kaynağı aktif et"
6. Click "Ekle"

### Usage
Sources are reference links for posts, tracking where content came from.

---

## Job Management (`/jobs`)

### Add Job Posting
1. Click "Yeni İlan"
2. Fill in required fields:
   - Job Title
   - Company
   - Location
3. Select job type:
   - Tam Zamanlı (Full-time)
   - Yarı Zamanlı (Part-time)
   - Sözleşmeli (Contract)
   - Serbest (Freelance)
   - Staj (Internship)
4. Write job description
5. Add requirements (optional)
6. Enter salary range (optional)
7. Set expiration date (optional)
8. Check "İlanı aktif et"
9. Click "Ekle"

### View Job Details
Click "Görüntüle" to see full job posting in modal.

### Managing Active Jobs
- Inactive jobs won't appear in public listings
- Jobs past expiration date should be deactivated

---

## Menu Management (`/menus`)

### Add Menu Item
1. Click "Yeni Menü"
2. Enter menu name
3. Slug auto-generates
4. Enter URL (can be relative `/about` or absolute `https://...`)
5. Set order (numeric, lower = appears first)
6. Check "Menüyü aktif et"
7. **Advanced (optional):**
   - Parent Menu ID: For submenu items
   - Category ID: Link to category
8. Click "Ekle"

### Creating Submenus
1. Create parent menu first (note its ID)
2. Create child menu
3. Set Parent ID to parent menu's ID

### Ordering Menus
- Use Order field to control display order
- Lower numbers appear first
- Example: 0, 10, 20, 30

---

## Common Features

### Pagination
- Use arrows or page numbers to navigate
- Shows current range and total items
- "Önceki" = Previous, "Sonraki" = Next

### Modal Dialogs
- **Close:** Click X, click backdrop, or press Escape key
- **Cancel:** Click "İptal" to abort operation
- **Confirm:** Review changes before submitting

### Toast Notifications
- **Success (Green)**: Operation completed successfully
- **Error (Red)**: Something went wrong
- **Warning (Yellow)**: Caution message
- **Info (Blue)**: Information message
- Auto-dismiss after 5 seconds
- Click X to dismiss manually

### Dark Mode
- Toggle in your browser/system settings
- All pages and components support dark mode

### Loading States
- Skeleton loaders show while data loads
- Spinners in buttons during operations
- Table shows loading spinner

---

## Keyboard Shortcuts

- **Escape**: Close any modal
- **Enter**: Submit forms (when focused)
- **Tab**: Navigate through form fields

---

## Best Practices

### Users
- Use strong passwords
- Assign appropriate roles only
- Verify emails before activation
- Don't delete users with active content

### Pages
- Use descriptive titles
- Write good meta descriptions for SEO
- Keep content organized
- Preview before publishing

### Posts
- Review posts before approving
- Reject with reason (if possible)
- Check for duplicate content
- Verify source URLs

### Roles
- Start with minimal permissions
- Create roles for specific purposes
- Document what each role can do
- Review permissions regularly

### Hashtags
- Use lowercase, single words
- Avoid special characters
- Keep them relevant
- Deactivate unused tags

### Sources
- Verify URLs are correct
- Use trusted sources only
- Keep descriptions clear
- Update outdated sources

### Jobs
- Keep information current
- Set realistic expiration dates
- Update or deactivate expired jobs
- Be clear about requirements

### Menus
- Use logical ordering
- Test links before publishing
- Keep menu structure simple
- Update broken links

---

## Troubleshooting

### "Kayıt bulunamadı" (No records found)
- Database might be empty
- Try adding items first
- Check API connection

### Can't Login
- Verify you have admin/superadmin/moderator role
- Check username and password
- Ensure backend is running
- Check `PUBLIC_API_URL` in `.env`

### Images Not Loading
- Check network tab for errors
- Verify API URL is correct
- Ensure backend is accessible

### Toast Doesn't Appear
- Check browser console for errors
- Toast should appear top-right
- May be briefly visible (5 seconds)

### Modal Won't Close
- Try pressing Escape key
- Click backdrop (dark area around modal)
- Check browser console for errors

### Data Not Saving
- Check form validation (red borders)
- Verify required fields are filled
- Check network errors in console
- Ensure you have proper permissions

---

## Tips & Tricks

1. **Bulk Operations**
   - Currently not supported, edit one by one
   - Plan: Will be added in future version

2. **Search**
   - Use browser search (Ctrl+F / Cmd+F) for now
   - Native search coming in future update

3. **Backup**
   - Regularly backup your database
   - No built-in export yet (planned feature)

4. **Performance**
   - Pagination helps with large datasets
   - Close unused modals
   - Refresh if data seems stale

5. **Mobile Use**
   - Fully responsive
   - Best experience on tablet or larger
   - Some features easier on desktop

---

## Support

### Issues
- Check browser console for errors
- Verify backend API is running
- Check network connectivity
- Review `.env` configuration

### Logs
Development mode shows console logs:
```bash
npm run dev
```

### API Testing
Test backend endpoints directly:
```bash
curl http://localhost:9000/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Deployment

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

### Environment
Update `.env` for production:
```env
PUBLIC_API_URL=https://api.yourdomain.com
```

### Hosting
Compatible with:
- Vercel
- Netlify
- Any static hosting with adapter
- Docker containers

---

## Quick Reference

### Common Turkish Terms
- **Ekle** = Add
- **Düzenle** = Edit
- **Sil** = Delete
- **İptal** = Cancel
- **Güncelle** = Update
- **Görüntüle** = View
- **Onayla** = Approve
- **Reddet** = Reject
- **Aktif** = Active
- **Yayınla** = Publish

### Status Values
- **pending** = Beklemede (Waiting)
- **approved** = Onaylandı (Approved)
- **rejected** = Reddedildi (Rejected)
- **active** = Aktif (Active)
- **inactive** = Pasif (Inactive)

---

## Version History

**v1.0.0** - January 19, 2026
- Initial release with all CRUD pages
- Dashboard with live statistics
- Complete UI component library
- Dark mode support
- Turkish language support
- Full authentication system
