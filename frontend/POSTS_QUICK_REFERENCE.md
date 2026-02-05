# Posts Section - Quick Reference Guide

## 📁 File Structure

```
frontend/src/app/posts/
├── page.tsx                    # Posts list page (/posts)
└── [post]/
    ├── page.tsx               # Post detail page (/posts/:slug)
    ├── loading.tsx            # Loading state
    ├── error.tsx              # Error state  
    └── not-found.tsx          # 404 state
```

## 🚀 Quick Start

### View a Post
Navigate to: `http://localhost:3000/posts/[slug]`

Example: `http://localhost:3000/posts/my-awesome-post`

### View All Posts
Navigate to: `http://localhost:3000/posts`

## 🔌 API Integration

### Endpoint
```
GET /posts/:slug?incrementView=true
```

### Response Structure
```typescript
{
  data: {
    id: number;
    title: string;
    slug: string;
    content: string;
    headerImage: Media | null;
    author: Author;
    postLikes: PostLike[];
    comments: Comment[];
    categories: Category[];
    tags: Tag[];
    viewCount: number;
    // ... other fields
  },
  message: string;
}
```

### Important Notes
- ✅ Response is wrapped in `{ data: ..., message: ... }`
- ✅ `incrementView=true` query parameter tracks views
- ✅ Backend returns `headerImage` as Media object, not string
- ✅ All data includes author with safe fields (no passwords/emails)

## 🎨 Key Components

### Post Detail Page Features
- ✅ **SEO Metadata**: Dynamic title, description, OpenGraph, Twitter Cards
- ✅ **Author Info**: Avatar, name, username, verification badge
- ✅ **Post Content**: Sanitized HTML with prose styling
- ✅ **Header Image**: Responsive Next.js Image component
- ✅ **Categories**: Styled badge display
- ✅ **Tags**: Hashtag-prefixed display
- ✅ **Comments**: Full comment section with author info
- ✅ **Interactions**: Like, Comment, Save buttons (with counts)
- ✅ **View Count**: Display and tracking
- ✅ **Dark Mode**: Full dark mode support

## 🛠️ Common Tasks

### Modify Post Layout
Edit: `frontend/src/app/posts/[post]/page.tsx`

### Customize Loading Skeleton
Edit: `frontend/src/app/posts/[post]/loading.tsx`

### Update Error Messages
Edit: `frontend/src/app/posts/[post]/error.tsx`

### Change 404 Page
Edit: `frontend/src/app/posts/[post]/not-found.tsx`

### Update Type Definitions
Edit: `frontend/src/types/types.ts`

## 🔍 Type Definitions

### IPost
```typescript
interface IPost {
  id: number;
  title: string;
  slug: string;
  content?: string;
  author: IAuthor;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  postLikes?: any[];
  comments?: IComment[];
  categories?: IPostCategory[];
  tags: ITag[];
  headerImage?: IMedia | string | null;
  viewCount?: number;
}
```

### IComment
```typescript
interface IComment {
  id: string | number;
  content: string;
  author: IAuthor;
  createdAt?: string;
}
```

### IAuthor
```typescript
interface IAuthor {
  id?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: IMedia | null;
  verified?: boolean;
}
```

## 🎯 Key Patterns

### Fetching a Post (SSR)
```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}?incrementView=true`,
  {
    cache: "no-store",
    next: { revalidate: 60 }
  }
);

const { data: postData }: PostResponse = await response.json();
```

### Handling Header Image
```typescript
const headerImageUrl = postData.headerImage && 
  typeof postData.headerImage === 'object'
    ? postData.headerImage.url
    : null;
```

### Displaying Author Avatar
```typescript
const getAuthorProfilePicture = () => {
  if (postData.author.profilePicture) {
    if (typeof postData.author.profilePicture === 'object') {
      return postData.author.profilePicture.url;
    }
    if (typeof postData.author.profilePicture === 'string') {
      return postData.author.profilePicture;
    }
  }
  return ppImage; // default
};
```

### Sanitizing Content
```typescript
import DOMPurify from "isomorphic-dompurify";

const sanitizedContent = DOMPurify.sanitize(postData.content || "");

<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
```

## 🎨 Styling Classes

### Container
```jsx
<div className="flex py-5 basis-full xl:basis-3/4">
  <SideMenu />
  <div className="flex flex-wrap w-full max-w-4xl mx-2">
    {/* Content */}
  </div>
</div>
```

### Post Card
```jsx
<article className="w-full p-6 mb-4 rounded-lg border 
  bg-white text-black dark:text-white 
  border-gray-300 dark:bg-DarkerGrey dark:border-DarkLightGrey">
  {/* Post content */}
</article>
```

### Action Button
```jsx
<button className="flex items-center gap-2 px-4 py-2 text-sm 
  border border-gray-300 dark:border-DarkLightGrey 
  hover:border-eksiCode hover:text-eksiCode 
  rounded-lg transition-colors duration-200">
  <Icon />
  <span>Text</span>
</button>
```

### Prose Content
```jsx
<div className="prose dark:prose-invert max-w-none
  prose-headings:text-black dark:prose-headings:text-white
  prose-p:text-gray-800 dark:prose-p:text-gray-200">
  {/* HTML content */}
</div>
```

## 🚨 Error Handling

### Not Found (404)
```typescript
if (response.status === 404) {
  notFound(); // Triggers not-found.tsx
}
```

### General Errors
```typescript
if (!response.ok) {
  throw new Error(`Failed to fetch: ${response.status}`);
  // Triggers error.tsx
}
```

### Error Boundary
Automatically catches errors in `error.tsx` with retry functionality.

## 📊 SEO Best Practices

### Metadata Generation
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const postData = await fetchPost(params.post);
  
  return {
    title: `${postData.title} - EksiCode`,
    description: postData.content?.substring(0, 160),
    openGraph: {
      title: postData.title,
      type: "article",
      images: [headerImageUrl],
      // ...
    },
  };
}
```

### Image Optimization
```jsx
<Image
  src={headerImageUrl}
  alt={altText}
  width={1200}
  height={630}
  priority // For above-the-fold images
/>
```

## 🧪 Testing

### Check Post Display
1. Navigate to `/posts/test-slug`
2. Verify all sections render correctly
3. Check dark mode toggle
4. Test on mobile/tablet/desktop

### Check Error States
1. Navigate to `/posts/non-existent-slug` → Should show 404
2. Stop backend → Should show error page
3. Test retry functionality

### Check Loading State
1. Throttle network in DevTools
2. Navigate to post
3. Should see loading skeleton

## 🔧 Troubleshooting

### "Post not found" error
- ✅ Check slug is correct
- ✅ Verify backend is running
- ✅ Check post exists in database
- ✅ Verify post is published/approved

### Images not loading
- ✅ Check `NEXT_PUBLIC_API_URL` in `.env`
- ✅ Verify image URLs are absolute
- ✅ Check Next.js image domains in `next.config.mjs`

### Styles not applying
- ✅ Check dark mode classes
- ✅ Verify Tailwind is configured
- ✅ Check custom theme colors in `tailwind.config.ts`

### API response error
- ✅ Verify response structure matches `PostResponse` type
- ✅ Check if `data` property exists in response
- ✅ Ensure backend returns proper structure

## 📦 Dependencies

```json
{
  "next": "^15.x",
  "react": "^19.x",
  "isomorphic-dompurify": "^2.x",
  "react-icons": "^5.x"
}
```

## 🔗 Related Files

- `frontend/src/components/Posts.tsx` - Posts list component
- `frontend/src/components/PostCard.tsx` - Post card component
- `frontend/src/components/Nav/SideMenu.tsx` - Side navigation
- `frontend/src/utils/utils.ts` - Utility functions (formatDate)
- `backend/src/controllers/post.controller.ts` - Backend controller
- `backend/src/services/post.service.ts` - Backend service

## 📝 Future TODOs

- [ ] Implement like functionality
- [ ] Add comment form and submission
- [ ] Implement save/bookmark feature
- [ ] Add social share buttons
- [ ] Show related posts
- [ ] Add post analytics (read time, scroll depth)
- [ ] Implement rich snippets (JSON-LD)
- [ ] Add print stylesheet

## 🆘 Need Help?

See the full documentation: `POSTS_REFACTORING_SUMMARY.md`

---

**Last Updated**: January 19, 2026
