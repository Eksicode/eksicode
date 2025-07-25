// Post status enum
export enum PostStatusEnum {
  draft = 'DRAFT',
  published = 'PUBLISHED',
  archived = 'ARCHIVED'
}

// Media interface
interface Media {
  id: number;
  url: string;
  altText?: string;
  type: string;
}

// User interface (referenced by Post)
interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  verified: boolean;
  profilePicture?: Media;
  createdAt: Date;
  updatedAt: Date;
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
  author: User;
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
  headerImage?: Media;
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
  headerImageId?: number;
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