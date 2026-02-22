import { PostStatus, MediaType } from '@prisma/client';

// Post status enum - aligned with Prisma schema
export enum PostStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  SCHEDULED = 'SCHEDULED'
}

// Media interface - aligned with Prisma Media model
export interface Media {
  id: number;
  originalName: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  altText?: string;
  type: MediaType;
  folder?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User interface (referenced by Post) - safe for public exposure
export interface User {
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
export interface PostLike {
  id: number;
  postId: number;
  userId: number;
  createdAt: Date;
}

// Comment interface
export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

// PostCategory interface
export interface PostCategory {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tag (Hashtag) interface - aligned with Prisma Tag model
export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Main Post interface - aligned with Prisma schema
export interface IPost {
  id: number;
  title: string;
  content: string;
  headerImageId?: number;
  headerImage?: Media;
  authorId: number;
  author: User;
  postLikes: PostLike[];
  comments: Comment[];
  categories: PostCategory[];
  tags: Tag[];
  status: PostStatusEnum;
  slug: string;
  approved: boolean;
  publishedAt?: Date;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs for API operations
export interface CreatePostDTO {
  title: string;
  content: string;
  headerImageId?: number;
  categories?: number[]; // Array of category IDs
  tags?: string[]; // Array of tag names
  status?: PostStatusEnum;
  slug?: string; // Optional, can be auto-generated
  approved?: boolean;
  publishedAt?: Date;
}

export interface UpdatePostDTO extends Partial<CreatePostDTO> {
  id: number;
}

export interface PostSearchParams {
  term?: string;
  hashtag?: string;
  category?: string;
  author?: string;
  status?: PostStatusEnum;
  approved?: boolean;
  skip?: number;
  limit?: number;
}

export interface PostListParams {
  skip?: number;
  limit?: number;
  summaryOnly?: boolean;
  status?: PostStatusEnum;
  approved?: boolean;
  authorId?: number;
  categoryId?: number;
  tagId?: number;
}

// Response interfaces
export interface PostListResponse {
  data: IPost[];
  meta: {
    total: number;
    skip: number;
    limit: number;
    currentPage: number;
    totalPages: number;
    summaryOnly: boolean;
  };
  message: string;
}

export interface PostSearchResponse {
  data: IPost[];
  count: number;
  message: string;
}

export interface PostResponse {
  data: IPost;
  message: string;
}

// Post statistics interface
export interface PostStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  pendingApproval: number;
  totalViews: number;
  averageViews: number;
}