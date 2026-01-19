# Telegram Groups - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Panel (SvelteKit)                 │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                   Sidebar Navigation                   │ │
│  │  • Dashboard                                          │ │
│  │  • Sayfalar                                           │ │
│  │  • Kullanıcılar                                       │ │
│  │  • Posts                                              │ │
│  │  • Roller                                             │ │
│  │  • Menüler                                            │ │
│  │  • Etiketler                                          │ │
│  │  • Kaynaklar                                          │ │
│  │  • ► Telegram Grupları ◄ (NEW)                       │ │
│  │  • Kariyer                                            │ │
│  │  • Ayarlar                                            │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │          /telegram-groups/+page.svelte                │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Table Component                                │ │ │
│  │  │  • Grup Adı                                     │ │ │
│  │  │  • Üye Sayısı                                   │ │ │
│  │  │  • Kanal ID                                     │ │ │
│  │  │  • Sıra                                         │ │ │
│  │  │  • Aktif                                        │ │ │
│  │  │  • [Edit] [Delete] Actions                      │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Add/Edit Modal                                 │ │ │
│  │  │  • Input: Grup Adı (required)                   │ │ │
│  │  │  • Input: Kanal ID                              │ │ │
│  │  │  • Input: Üye Sayısı (required)                 │ │ │
│  │  │  • Input: Sıra                                  │ │ │
│  │  │  • Input: Grup Linki (required)                 │ │ │
│  │  │  • Input: İkon                                  │ │ │
│  │  │  • Textarea: Açıklama                           │ │ │
│  │  │  • Checkbox: Aktif                              │ │ │
│  │  │  • [İptal] [Ekle/Güncelle]                      │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Delete Confirmation Modal                      │ │ │
│  │  │  "Are you sure you want to delete {name}?"      │ │ │
│  │  │  [İptal] [Sil]                                  │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Pagination Component                           │ │ │
│  │  │  [←] 1 2 3 4 5 [→]                              │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ▼
                    ┌───────────────┐
                    │  API Client   │
                    │  (client.ts)  │
                    └───────────────┘
                            ▼
                    ┌───────────────┐
                    │  API Utils    │
                    │   (api.ts)    │
                    │  • getData()  │
                    │  • addData()  │
                    │  • updateData()│
                    │  • deleteData()│
                    └───────────────┘
                            ▼
                            │
                    HTTP Requests
                            │
┌───────────────────────────┼───────────────────────────┐
│                           ▼                           │
│              Backend API (Express.js)                 │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │         Routes (telegram.route.ts)              │ │
│  │                                                 │ │
│  │  • GET    /telegrams                           │ │
│  │  • GET    /telegrams/:id                       │ │
│  │  • POST   /telegrams         [Auth Required]   │ │
│  │  • PUT    /telegrams/:id     [Auth Required]   │ │
│  │  • DELETE /telegrams/:id     [Auth Required]   │ │
│  └─────────────────────────────────────────────────┘ │
│                           ▼                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │      Controller (telegram.controller.ts)        │ │
│  │                                                 │ │
│  │  • getAllTelegramGroups()                      │ │
│  │  • getTelegramGroupById()                      │ │
│  │  • createTelegramGroup()                       │ │
│  │  • updateTelegramGroup()                       │ │
│  │  • deleteTelegramGroup()                       │ │
│  └─────────────────────────────────────────────────┘ │
│                           ▼                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │        Service (telegram.service.ts)            │ │
│  │                                                 │ │
│  │  • getAllTelegramGroups()                      │ │
│  │  • getTelegramGroupById()                      │ │
│  │  • createTelegramGroup()                       │ │
│  │  • updateTelegramGroup()                       │ │
│  │  • deleteTelegramGroup()                       │ │
│  └─────────────────────────────────────────────────┘ │
│                           ▼                           │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Prisma ORM                         │ │
│  │         (Database Abstraction)                  │ │
│  └─────────────────────────────────────────────────┘ │
└───────────────────────────┼───────────────────────────┘
                            ▼
┌───────────────────────────────────────────────────────┐
│              PostgreSQL Database                      │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │         Table: telegram_groups                  │ │
│  │                                                 │ │
│  │  • id (PK, auto-increment)                     │ │
│  │  • name (unique, varchar(255))                 │ │
│  │  • icon (varchar(255), nullable)               │ │
│  │  • members (integer, default: 0)               │ │
│  │  • link (varchar(500))                         │ │
│  │  • channelId (varchar(100), unique, nullable)  │ │
│  │  • listOrder (integer, nullable)               │ │
│  │  • description (text, nullable)                │ │
│  │  • active (boolean, default: true)             │ │
│  │  • createdAt (timestamp)                       │ │
│  │  • updatedAt (timestamp)                       │ │
│  │                                                 │ │
│  │  Indexes:                                       │ │
│  │  • idx_name                                     │ │
│  │  • idx_channelId                                │ │
│  │  • idx_listOrder                                │ │
│  │  • idx_active                                   │ │
│  └─────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Load Telegram Groups (GET)

```
User clicks "Telegram Grupları"
            │
            ▼
    +page.svelte onMount()
            │
            ▼
    loadTelegramGroups()
            │
            ▼
    getData('telegrams', false, 10, 1)
            │
            ▼
    API Client: GET /telegrams?page=1&limit=10
            │
            ▼
    Backend: TelegramRoute.get('/telegrams')
            │
            ▼
    TelegramController.getAllTelegramGroups()
            │
            ▼
    TelegramService.getAllTelegramGroups()
            │
            ▼
    Prisma: findMany() + count()
            │
            ▼
    PostgreSQL: SELECT * FROM telegram_groups
            │
            ▼
    Response: { data: [...], meta: { total, page, ... } }
            │
            ▼
    Update UI: Display table + pagination
```

### 2. Add New Telegram Group (POST)

```
User clicks "Yeni Telegram Grubu"
            │
            ▼
    openAddModal()
            │
            ▼
    User fills form and clicks "Ekle"
            │
            ▼
    handleSubmit()
            │
            ▼
    addData('telegrams', formData)
            │
            ▼
    API Client: POST /telegrams (with auth token)
            │
            ▼
    Backend: authMiddleware → check token
            │
            ▼
    TelegramController.createTelegramGroup()
            │
            ▼
    TelegramService.createTelegramGroup()
            │
            ▼
    Prisma: create()
            │
            ▼
    PostgreSQL: INSERT INTO telegram_groups
            │
            ▼
    Response: { success: true, data: {...} }
            │
            ▼
    Show success toast + reload list + close modal
```

### 3. Update Telegram Group (PUT)

```
User clicks Edit icon for a group
            │
            ▼
    openEditModal(group)
            │
            ▼
    Pre-fill form with group data
            │
            ▼
    User modifies fields and clicks "Güncelle"
            │
            ▼
    handleSubmit()
            │
            ▼
    updateData('telegrams', id, formData)
            │
            ▼
    API Client: PUT /telegrams/:id (with auth token)
            │
            ▼
    Backend: authMiddleware → check token
            │
            ▼
    TelegramController.updateTelegramGroup()
            │
            ▼
    TelegramService.updateTelegramGroup()
            │
            ▼
    Prisma: update()
            │
            ▼
    PostgreSQL: UPDATE telegram_groups WHERE id = ?
            │
            ▼
    Response: { success: true, data: {...} }
            │
            ▼
    Show success toast + reload list + close modal
```

### 4. Delete Telegram Group (DELETE)

```
User clicks Delete icon for a group
            │
            ▼
    openDeleteModal(group)
            │
            ▼
    User confirms by clicking "Sil"
            │
            ▼
    handleDelete()
            │
            ▼
    deleteData('telegrams', id)
            │
            ▼
    API Client: DELETE /telegrams/:id (with auth token)
            │
            ▼
    Backend: authMiddleware → check token
            │
            ▼
    TelegramController.deleteTelegramGroup()
            │
            ▼
    TelegramService.deleteTelegramGroup()
            │
            ▼
    Prisma: delete()
            │
            ▼
    PostgreSQL: DELETE FROM telegram_groups WHERE id = ?
            │
            ▼
    Response: { success: true, message: "..." }
            │
            ▼
    Show success toast + reload list + close modal
```

## Authentication Flow

```
┌─────────────────────────────────────────┐
│         User Login (Separate)           │
└─────────────────────────────────────────┘
                  │
                  ▼
        Token stored in authStore
                  │
                  ▼
┌─────────────────────────────────────────┐
│    Every API Request (POST/PUT/DELETE)  │
│                                         │
│  Request Headers:                       │
│  {                                      │
│    "Authorization": "Bearer <token>"    │
│    "Content-Type": "application/json"   │
│  }                                      │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Backend: authMiddleware         │
│                                         │
│  1. Extract token from header           │
│  2. Verify token                        │
│  3. If valid → proceed                  │
│  4. If invalid → return 401             │
└─────────────────────────────────────────┘
                  │
                  ▼
         Controller → Service → DB
```

## Component Hierarchy

```
AdminLayout
│
├── Sidebar
│   └── NavigationItem: "Telegram Grupları" → /telegram-groups
│
└── Main Content Area
    │
    └── TelegramGroupsPage (+page.svelte)
        │
        ├── Header
        │   ├── Title: "Telegram Grupları"
        │   └── Button: "Yeni Telegram Grubu"
        │
        ├── Table
        │   ├── TableHeader
        │   │   ├── Column: Grup Adı
        │   │   ├── Column: Üye Sayısı
        │   │   ├── Column: Kanal ID
        │   │   ├── Column: Sıra
        │   │   ├── Column: Aktif
        │   │   ├── Column: Oluşturulma Tarihi
        │   │   └── Column: İşlemler
        │   │
        │   └── TableBody
        │       └── TableRow (for each group)
        │           ├── Cell: name
        │           ├── Cell: members
        │           ├── Cell: channelId
        │           ├── Cell: listOrder
        │           ├── Cell: active (✓/✗)
        │           ├── Cell: createdAt (formatted)
        │           └── Cell: Actions
        │               ├── EditButton → openEditModal()
        │               └── DeleteButton → openDeleteModal()
        │
        ├── Pagination
        │   ├── Previous Button
        │   ├── Page Numbers
        │   └── Next Button
        │
        ├── Modal (isModalOpen)
        │   ├── ModalHeader
        │   │   └── Title: "Yeni/Düzenle Telegram Grubu"
        │   │
        │   ├── ModalBody
        │   │   └── Form
        │   │       ├── Input: name
        │   │       ├── Input: channelId
        │   │       ├── Input: members
        │   │       ├── Input: listOrder
        │   │       ├── Input: link
        │   │       ├── Input: icon
        │   │       ├── Textarea: description
        │   │       └── Checkbox: active
        │   │
        │   └── ModalFooter
        │       ├── Button: "İptal" → closeModal()
        │       └── Button: "Ekle/Güncelle" → handleSubmit()
        │
        └── Modal (isDeleteModalOpen)
            ├── ModalHeader
            │   └── Title: "Telegram Grubunu Sil"
            │
            ├── ModalBody
            │   └── Confirmation Message
            │
            └── ModalFooter
                ├── Button: "İptal" → closeDeleteModal()
                └── Button: "Sil" → handleDelete()
```

## State Management

```javascript
// Component State
let telegramGroups: TelegramGroup[] = [];      // List of groups
let loading = false;                           // Loading indicator
let isModalOpen = false;                       // Add/Edit modal state
let isDeleteModalOpen = false;                 // Delete modal state
let editingGroup: TelegramGroup | null = null; // Currently editing
let deletingGroup: TelegramGroup | null = null;// Currently deleting
let currentPage = 1;                           // Pagination state
let totalPages = 1;                            // Total pages
let totalItems = 0;                            // Total items count
const itemsPerPage = 10;                       // Items per page

// Form State
let formData = {
  name: '',
  icon: '',
  members: 0,
  link: '',
  channelId: '',
  listOrder: 0,
  description: '',
  active: true
};

// Global State (from stores)
authStore.token                                // JWT token
toastStore                                     // Toast notifications
```

## Error Handling

```
API Call Error
      │
      ├── Network Error
      │   └── Show: "Network error occurred"
      │
      ├── Authentication Error (401)
      │   └── Show: "Authentication required"
      │       └── Redirect to login
      │
      ├── Validation Error (400)
      │   └── Show: Error message from backend
      │
      ├── Not Found (404)
      │   └── Show: "Resource not found"
      │
      └── Server Error (500)
          └── Show: "Server error occurred"

All errors displayed via Toast notification
```

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. Frontend Input Validation          │
│     • Required fields                   │
│     • URL validation                    │
│     • Number validation                 │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  2. Authentication Middleware           │
│     • Token verification                │
│     • User identification               │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  3. Backend Input Validation            │
│     • Type checking                     │
│     • Format validation                 │
│     • Business rules                    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  4. Database Constraints                │
│     • Unique constraints                │
│     • NOT NULL constraints              │
│     • Foreign key constraints           │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  5. Prisma ORM                          │
│     • SQL injection prevention          │
│     • Parameterized queries             │
└─────────────────────────────────────────┘
```

## File Structure

```
eksicode-latest/
│
├── admin/
│   ├── src/
│   │   ├── routes/
│   │   │   └── telegram-groups/
│   │   │       └── +page.svelte ........... Main page component
│   │   │
│   │   └── lib/
│   │       ├── api/
│   │       │   ├── client.ts ............. HTTP client
│   │       │   └── types.ts .............. TypeScript interfaces
│   │       │
│   │       ├── auth/
│   │       │   └── store.ts .............. Auth state management
│   │       │
│   │       ├── components/
│   │       │   ├── layout/
│   │       │   │   ├── AdminLayout.svelte  Layout wrapper
│   │       │   │   ├── Header.svelte ..... Header component
│   │       │   │   └── Sidebar.svelte .... Navigation (MODIFIED)
│   │       │   │
│   │       │   └── ui/
│   │       │       ├── Button.svelte ..... Button component
│   │       │       ├── Input.svelte ...... Form input
│   │       │       ├── Modal.svelte ...... Modal dialog
│   │       │       ├── Pagination.svelte . Pagination
│   │       │       ├── Table.svelte ...... Data table
│   │       │       └── Toast.svelte ...... Notifications
│   │       │
│   │       ├── stores/
│   │       │   ├── settings.ts ........... Settings state
│   │       │   ├── theme.ts .............. Theme state
│   │       │   └── toast.ts .............. Toast state
│   │       │
│   │       └── utils/
│   │           └── api.ts ................. API utility functions
│   │
│   └── Documentation/
│       ├── TELEGRAM_GROUPS_IMPLEMENTATION.md
│       ├── TELEGRAM_GROUPS_QUICK_REFERENCE.md
│       ├── TELEGRAM_GROUPS_ARCHITECTURE.md
│       └── REFACTORING_2026_01_19_TELEGRAM_GROUPS.md
│
└── backend/
    └── src/
        ├── routes/
        │   └── telegram.route.ts ......... API routes (FIXED)
        │
        ├── controllers/
        │   └── telegram.controller.ts .... Request handlers
        │
        ├── services/
        │   └── telegram.service.ts ....... Business logic
        │
        ├── middlewares/
        │   └── auth.middleware.ts ........ Authentication
        │
        └── config/
            └── database.ts ............... Prisma client
```

---

## Summary

This architecture provides:
- **Clean separation of concerns** (Route → Controller → Service → DB)
- **Reusable components** (Table, Modal, Button, Input, etc.)
- **Type safety** (TypeScript interfaces throughout)
- **Authentication** (Token-based auth for write operations)
- **Error handling** (Multiple layers of validation and error feedback)
- **Scalability** (Pagination, indexed database queries)
- **Maintainability** (Clear file structure, documented code)
