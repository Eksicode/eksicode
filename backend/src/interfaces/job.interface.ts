// Post status enum
enum PostStatusEnum {
  draft = 'draft',
  published = 'published',
  archived = 'archived'
}

// User interface (referenced by Post)
interface User {
  id: number;
  // Add other user fields as needed
}

// PostLike interface
interface PostLike {
  id: number;
  postId: number;
  userId: number;
}

// Comment interface
interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
}

// PostCategory interface
interface PostCategory {
  id: number;
  name: string;
}

// HashTag interface
interface HashTag {
  id: number;
  name: string;
}

// Main Post interface
export interface IPost {
  id: number;
  title: string;
  content: string;
  headerImage?: string;
  authorId: number;
  author: User;
  postLikes: PostLike[];
  comments: Comment[];
  categories: PostCategory[];
  tags: HashTag[];
  status: PostStatusEnum;
  slug: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creating a new post (omitting auto-generated fields)
interface CreatePostDTO {
  title: string;
  content: string;
  headerImage?: string;
  authorId: number;
  categories: number[]; // Array of category IDs
  tags: number[]; // Array of tag IDs
  status?: PostStatusEnum;
  slug: string;
  approved?: boolean;
}

// Interface for updating a post
interface UpdatePostDTO extends Partial<CreatePostDTO> {
  id: number;
}