import { Tag } from '@prisma/client';

// Tag (Hashtag) interface - aligned with Prisma Tag model
export interface IHashtag {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Hashtag with post count for listing
export interface IHashtagWithPostCount extends IHashtag {
  postCount: number;
}

// Hashtag with related data
export interface IHashtagWithRelations extends IHashtag {
  _count: {
    posts: number;
    sources: number;
  };
  posts?: Array<{
    id: number;
    title: string;
    slug: string;
    createdAt: Date;
  }>;
  sources?: Array<{
    id: number;
    title: string;
    url: string;
  }>;
}

// DTOs for API operations
export interface CreateHashtagDTO {
  name: string;
  slug?: string; // Optional, can be auto-generated
}

export interface UpdateHashtagDTO extends Partial<CreateHashtagDTO> {
  id: number;
}

export interface HashtagSearchParams {
  term?: string;
  skip?: number;
  limit?: number;
  includePosts?: boolean;
  includeSources?: boolean;
}

export interface HashtagListParams {
  skip?: number;
  limit?: number;
  orderBy?: 'name' | 'createdAt' | 'postCount';
  orderDirection?: 'asc' | 'desc';
  includePostCount?: boolean;
}

// Response interfaces
export interface HashtagListResponse {
  data: IHashtagWithPostCount[];
  meta: {
    total: number;
    skip: number;
    limit: number;
    currentPage: number;
    totalPages: number;
  };
  message: string;
}

export interface HashtagResponse {
  data: IHashtagWithRelations;
  message: string;
}

export interface HashtagSearchResponse {
  data: IHashtagWithPostCount[];
  count: number;
  message: string;
}

// Hashtag statistics interface
export interface HashtagStats {
  totalHashtags: number;
  hashtagsWithPosts: number;
  hashtagsWithSources: number;
  averagePostsPerHashtag: number;
  mostUsedHashtags: Array<{
    id: number;
    name: string;
    postCount: number;
  }>;
}

// Utility types
export type HashtagOrderBy = 'name' | 'createdAt' | 'postCount';
export type HashtagOrderDirection = 'asc' | 'desc'; 