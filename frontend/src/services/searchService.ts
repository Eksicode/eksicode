import getData from "@/utils/getData";
import type { IPost } from "@/types/types";
import type { PaginationMeta } from "@/types/hashtag.types";

// Search parameters
export interface SearchParams {
  term?: string;
  hashtag?: string;
  page?: number;
  limit?: number;
}

// Search response from API
export interface SearchApiResponse {
  data: IPost[];
  count: number;
  message: string;
}

// Transformed search response for frontend
export interface SearchResponse {
  posts: IPost[];
  meta: PaginationMeta;
  message: string;
}

/**
 * Search posts by term or hashtag using the backend API
 * 
 * The search covers multiple fields:
 * - Post title
 * - Post content  
 * - Author username
 * - Category names
 * - Hashtag/tag names
 * 
 * @param params Search parameters including term, hashtag, pagination
 * @param options Fetch options for caching and revalidation
 * @returns Promise with search results and pagination metadata
 */
export const searchPosts = async (
  params: SearchParams,
  options: {
    cache?: RequestCache;
    next?: { revalidate: number };
  } = { cache: "no-store" } // No cache for search results by default
): Promise<SearchResponse> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API URL is not defined");
    }

    const { term, hashtag, page = 1, limit = 10 } = params;

    // Validate that at least one search parameter is provided
    if (!term && !hashtag) {
      throw new Error("Search term or hashtag is required");
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    const skip = (page - 1) * limit;

    queryParams.set('skip', skip.toString());
    queryParams.set('limit', limit.toString());

    if (term) {
      queryParams.set('term', term);
    }

    if (hashtag) {
      queryParams.set('hashtag', hashtag);
    }

    // Make the API call
    const response = await fetch(
      `${apiUrl}/posts/search?${queryParams.toString()}`,
      {
        cache: options.cache,
        next: options.next,
      }
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }

    const result: SearchApiResponse = await response.json();

    // Transform to frontend format with pagination meta
    const meta: PaginationMeta = {
      page,
      pageSize: limit,
      totalPages: Math.ceil(result.count / limit),
      total: result.count
    };

    return {
      posts: result.data || [],
      meta,
      message: result.message
    };

  } catch (error) {
    console.error('Error in searchPosts:', error);
    return {
      posts: [],
      meta: {
        page: 1,
        pageSize: params.limit || 10,
        totalPages: 0,
        total: 0
      },
      message: 'Error searching posts'
    };
  }
};

/**
 * Search posts by text term only
 */
export const searchPostsByTerm = async (
  term: string,
  page: number = 1,
  limit: number = 10,
  options?: { cache?: RequestCache; next?: { revalidate: number } }
): Promise<SearchResponse> => {
  return searchPosts({ term, page, limit }, options);
};

/**
 * Search posts by hashtag only
 */
export const searchPostsByHashtag = async (
  hashtag: string,
  page: number = 1,
  limit: number = 10,
  options?: { cache?: RequestCache; next?: { revalidate: number } }
): Promise<SearchResponse> => {
  return searchPosts({ hashtag, page, limit }, options);
};
