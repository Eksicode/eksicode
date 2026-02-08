// Common hashtag types shared across the application

export interface HashtagBase {
  id: number;
  name: string;
}

// Backend API response from hashtag service
export interface HashtagApiResponse extends HashtagBase {
  slug?: string;
  postCount?: number;
}

// Frontend hashtag with additional UI fields
export interface Hashtag extends HashtagBase {
  slug: string;
  postCount: number;
  icon: string;
  description: string;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T[];
  meta: PaginationMeta;
  message: string;
}

// Hashtag service response
export type HashtagServiceResponse = ApiResponse<Hashtag>;

// Search parameters for hashtag endpoints
export interface HashtagSearchParams {
  page?: number;
  limit?: number;
  query?: string;
}

// Cache options for fetch requests
export interface CacheOptions {
  cache?: RequestCache;
  next?: { revalidate: number };
}
