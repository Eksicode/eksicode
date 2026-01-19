# Posts Section Architecture

## 📐 Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      EksiCode Frontend                      │
│                     /posts Architecture                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         Routes                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  /posts                                                      │
│  ├─ page.tsx           → Posts List Page                    │
│  │  ├─ Metadata         ✓ SEO optimized                    │
│  │  ├─ SideMenu         ✓ Navigation                       │
│  │  └─ <Posts />        ✓ List component with pagination   │
│  │                                                           │
│  └─ /posts/[slug]                                           │
│     ├─ page.tsx         → Post Detail Page (SSR)            │
│     │  ├─ generateMetadata()  ✓ Dynamic SEO                │
│     │  ├─ Author Section      ✓ With avatar & verification │
│     │  ├─ Post Content        ✓ Sanitized HTML             │
│     │  ├─ Categories          ✓ Badge display              │
│     │  ├─ Tags                ✓ Hashtag display            │
│     │  ├─ Comments            ✓ Full comment section       │
│     │  └─ Actions             ✓ Like, Comment, Save        │
│     │                                                        │
│     ├─ loading.tsx      → Loading Skeleton                  │
│     │  └─ Animated skeleton matching layout                │
│     │                                                        │
│     ├─ error.tsx        → Error Boundary                    │
│     │  ├─ Error message                                     │
│     │  ├─ Retry button                                      │
│     │  └─ Navigation options                               │
│     │                                                        │
│     └─ not-found.tsx    → 404 Page                         │
│        ├─ Friendly message                                  │
│        └─ Navigation options                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

```
┌─────────────┐
│   Browser   │
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Next.js Server (SSR)                  │
│                                          │
│  1. Receive request /posts/:slug        │
│  2. Generate metadata                   │
│  3. Fetch post data from backend        │
│  4. Render page server-side             │
│  5. Send HTML to client                 │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Backend API                            │
│                                          │
│  GET /posts/:slug?incrementView=true    │
│  ├─ PostController.getPostBySlug()      │
│  ├─ PostService.getPostBySlug()         │
│  └─ Returns: { data: Post, message }    │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Database (PostgreSQL)                  │
│                                          │
│  SELECT * FROM posts                     │
│  WHERE slug = ?                          │
│  INCLUDE author, comments, categories,   │
│          tags, headerImage, postLikes    │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Response to Client                     │
│                                          │
│  {                                       │
│    data: {                               │
│      id, title, slug, content,          │
│      author: { ...safeFields },         │
│      headerImage: { url, ... },         │
│      comments: [...],                    │
│      categories: [...],                  │
│      tags: [...],                        │
│      postLikes: [...],                   │
│      viewCount, createdAt, ...          │
│    },                                    │
│    message: "Success"                    │
│  }                                       │
└─────────────────────────────────────────┘
```

## 🎨 Component Hierarchy

```
PostDetailPage (SSR)
│
├─ SideMenu
│  └─ Navigation links
│
└─ Main Content
   │
   ├─ Post Article
   │  │
   │  ├─ Author Section
   │  │  ├─ Avatar (Next/Image)
   │  │  ├─ Name + Verification badge
   │  │  ├─ Username
   │  │  └─ Timestamp + View count
   │  │
   │  ├─ Post Header
   │  │  ├─ Title (h1)
   │  │  ├─ Categories (badges)
   │  │  └─ Tags (hashtags)
   │  │
   │  ├─ Header Image (Next/Image)
   │  │  └─ Responsive, optimized
   │  │
   │  ├─ Post Content
   │  │  └─ Sanitized HTML with prose styling
   │  │
   │  └─ Action Buttons
   │     ├─ Like (with count)
   │     ├─ Comment (with count)
   │     └─ Save
   │
   └─ Comments Section
      │
      ├─ Section Header
      │  └─ "Yorumlar (count)"
      │
      └─ Comment List
         └─ Comment Card (for each)
            ├─ Author Avatar
            ├─ Author Info + Verification
            ├─ Comment Content
            └─ Timestamp
```

## 🔐 Type System

```
┌─────────────────────────────────────────┐
│         Frontend Types                   │
├─────────────────────────────────────────┤
│                                          │
│  interface PostResponse                  │
│  ├─ data: IPost                         │
│  └─ message: string                      │
│                                          │
│  interface IPost                         │
│  ├─ id: number                          │
│  ├─ title: string                       │
│  ├─ slug: string                        │
│  ├─ content?: string                    │
│  ├─ author: IAuthor                     │
│  ├─ headerImage?: IMedia | null         │
│  ├─ comments?: IComment[]               │
│  ├─ categories?: IPostCategory[]        │
│  ├─ tags: ITag[]                        │
│  ├─ postLikes?: any[]                   │
│  ├─ viewCount?: number                  │
│  └─ createdAt, updatedAt, publishedAt   │
│                                          │
│  interface IAuthor                       │
│  ├─ id?: string                         │
│  ├─ username: string                    │
│  ├─ firstName?: string                  │
│  ├─ lastName?: string                   │
│  ├─ profilePicture?: IMedia | null      │
│  └─ verified?: boolean                  │
│                                          │
│  interface IComment                      │
│  ├─ id: string | number                 │
│  ├─ content: string                     │
│  ├─ author: IAuthor                     │
│  └─ createdAt?: string                  │
│                                          │
│  interface IMedia                        │
│  ├─ id: number                          │
│  ├─ url: string                         │
│  ├─ altText?: string                    │
│  └─ type: string                        │
│                                          │
│  interface IPostCategory                 │
│  ├─ id: number                          │
│  ├─ name: string                        │
│  └─ slug?: string                       │
│                                          │
└─────────────────────────────────────────┘
```

## 🎯 State Management

```
┌─────────────────────────────────────────┐
│         Page States                      │
├─────────────────────────────────────────┤
│                                          │
│  1. LOADING                              │
│     ├─ Trigger: Initial page load       │
│     ├─ Display: loading.tsx             │
│     └─ Component: Skeleton UI           │
│                                          │
│  2. SUCCESS                              │
│     ├─ Trigger: Data fetched            │
│     ├─ Display: page.tsx                │
│     └─ Component: Full post detail      │
│                                          │
│  3. ERROR                                │
│     ├─ Trigger: Fetch failure           │
│     ├─ Display: error.tsx               │
│     └─ Component: Error with retry      │
│                                          │
│  4. NOT_FOUND                            │
│     ├─ Trigger: 404 response            │
│     ├─ Display: not-found.tsx           │
│     └─ Component: 404 message           │
│                                          │
└─────────────────────────────────────────┘
```

## 🔄 Caching Strategy

```
┌─────────────────────────────────────────┐
│         Cache Layers                     │
├─────────────────────────────────────────┤
│                                          │
│  1. Metadata Generation                  │
│     └─ cache: "force-cache"             │
│        (Static generation)               │
│                                          │
│  2. Post Content Fetch                   │
│     └─ cache: "no-store"                │
│        next: { revalidate: 60 }         │
│        (Fresh data, 1-min revalidate)   │
│                                          │
│  3. Images                               │
│     └─ Next.js Image Optimization       │
│        (Automatic caching)               │
│                                          │
└─────────────────────────────────────────┘
```

## 🎨 Styling Architecture

```
┌─────────────────────────────────────────┐
│         Styling Layers                   │
├─────────────────────────────────────────┤
│                                          │
│  1. Tailwind Base                        │
│     └─ Utility classes                  │
│                                          │
│  2. Custom Theme                         │
│     ├─ eksiCode color                   │
│     ├─ DarkerGrey background            │
│     └─ DarkLightGrey borders            │
│                                          │
│  3. Dark Mode                            │
│     └─ dark: variants                   │
│        (Automatic switching)             │
│                                          │
│  4. Prose Styling                        │
│     ├─ prose base                       │
│     ├─ dark:prose-invert                │
│     └─ Custom prose overrides           │
│                                          │
│  5. Component Variants                   │
│     ├─ Cards                            │
│     ├─ Buttons                          │
│     ├─ Badges                           │
│     └─ Animations                       │
│                                          │
└─────────────────────────────────────────┘
```

## 🔗 Dependencies Graph

```
┌─────────────────────────────────────────┐
│         External Dependencies            │
├─────────────────────────────────────────┤
│                                          │
│  Next.js 15                              │
│  ├─ App Router                          │
│  ├─ Server Components                   │
│  ├─ Image Optimization                  │
│  ├─ generateMetadata                    │
│  └─ Error Boundaries                    │
│                                          │
│  React 19                                │
│  ├─ Server Components                   │
│  ├─ Suspense                            │
│  └─ Error Boundaries                    │
│                                          │
│  isomorphic-dompurify                    │
│  └─ HTML Sanitization                   │
│                                          │
│  react-icons                             │
│  └─ Icon Components                     │
│                                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Internal Dependencies            │
├─────────────────────────────────────────┤
│                                          │
│  Components                              │
│  ├─ SideMenu                            │
│  ├─ Posts (list)                        │
│  └─ PostCard                            │
│                                          │
│  Types                                   │
│  └─ types.ts                            │
│     ├─ IPost                            │
│     ├─ IComment                         │
│     ├─ IAuthor                          │
│     └─ IMedia                           │
│                                          │
│  Utils                                   │
│  └─ utils.ts                            │
│     └─ formatDate()                     │
│                                          │
│  Assets                                  │
│  └─ images/pp-image.png                 │
│                                          │
└─────────────────────────────────────────┘
```

## 📊 Performance Metrics

```
┌─────────────────────────────────────────┐
│         Target Metrics                   │
├─────────────────────────────────────────┤
│                                          │
│  Lighthouse Score                        │
│  ├─ Performance:      90+               │
│  ├─ Accessibility:    95+               │
│  ├─ Best Practices:   95+               │
│  └─ SEO:              100               │
│                                          │
│  Core Web Vitals                         │
│  ├─ LCP: < 2.5s                         │
│  ├─ FID: < 100ms                        │
│  └─ CLS: < 0.1                          │
│                                          │
│  Bundle Size                             │
│  ├─ Page JS:  < 100KB                   │
│  ├─ First Load: < 200KB                 │
│  └─ Shared:   Optimized                 │
│                                          │
└─────────────────────────────────────────┘
```

## 🛡️ Security Measures

```
┌─────────────────────────────────────────┐
│         Security Layers                  │
├─────────────────────────────────────────┤
│                                          │
│  1. HTML Sanitization                    │
│     └─ DOMPurify on post content        │
│                                          │
│  2. Safe Author Data                     │
│     └─ Backend excludes sensitive fields│
│        (password, email, tokens)        │
│                                          │
│  3. Type Safety                          │
│     └─ TypeScript prevents type issues  │
│                                          │
│  4. XSS Prevention                       │
│     └─ Sanitized HTML rendering         │
│                                          │
│  5. CORS                                 │
│     └─ Backend CORS configuration       │
│                                          │
└─────────────────────────────────────────┘
```

## 🔧 Error Handling Flow

```
Request → fetch() → Response
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
     200 OK      404        5xx Error
        │           │           │
        ▼           ▼           ▼
    page.tsx   not-found   error.tsx
        │           │           │
        │           │           ▼
        │           │      [Retry Button]
        │           │           │
        │           │           ▼
        │           │      [Try Again]
        │           │
        ▼           ▼
   [Display    [404 Page]
    Content]       │
                   ▼
              [Go Home]
              [All Posts]
```

## 📱 Responsive Breakpoints

```
┌─────────────────────────────────────────┐
│         Breakpoint Strategy              │
├─────────────────────────────────────────┤
│                                          │
│  Mobile (< 640px)                        │
│  ├─ Single column                       │
│  ├─ Full width content                  │
│  ├─ Stacked elements                    │
│  └─ Touch-friendly buttons              │
│                                          │
│  Tablet (640px - 1024px)                 │
│  ├─ Two column layout                   │
│  ├─ Side menu visible                   │
│  └─ Adjusted spacing                    │
│                                          │
│  Desktop (> 1024px)                      │
│  ├─ Three column layout                 │
│  ├─ Max-width container                 │
│  ├─ Optimal reading width               │
│  └─ Full feature visibility             │
│                                          │
└─────────────────────────────────────────┘
```

---

**Last Updated**: January 19, 2026
