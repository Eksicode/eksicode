import getData from "@/utils/getData";
import type {
  Hashtag,
  HashtagApiResponse,
  HashtagServiceResponse,
  CacheOptions,
  PaginationMeta
} from "@/types/hashtag.types";

/**
 * Transform API hashtag response to frontend hashtag format
 */
const transformHashtagResponse = (apiHashtag: HashtagApiResponse): Hashtag => {
  const slug = apiHashtag.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim();

  return {
    id: apiHashtag.id,
    name: apiHashtag.name,
    slug,
    postCount: apiHashtag.postCount || 0,
    icon: '', // Default empty icon - could be enhanced with emoji or icon mapping
    description: `#${apiHashtag.name} etiketli ${apiHashtag.postCount || 0} yazı`
  };
};

/**
 * Fetch all hashtags from the API
 */
export const getAllHashtags = async (
  page: number = 1,
  limit: number = 50,
  options: CacheOptions = { next: { revalidate: 43200 } } // 12 hours cache by default
): Promise<HashtagServiceResponse> => {
  try {
    // Calculate skip from page number (backend expects skip, not page)
    const skip = (page - 1) * limit;
    
    const response = await getData<HashtagApiResponse, PaginationMeta>(
      'hashtags',
      false, // summaryOnly
      limit,
      page,
      skip,
      options
    );

    // Transform the API response to frontend format
    const transformedData = response.data.map(transformHashtagResponse);

    return {
      data: transformedData,
      meta: response.meta,
      message: response.message
    };
  } catch (error) {
    console.error('Error in getAllHashtags:', error);
    return {
      data: [],
      meta: {
        page: 1,
        pageSize: limit,
        totalPages: 0,
        total: 0
      },
      message: 'Error fetching hashtags'
    };
  }
};

/**
 * Fetch a single hashtag by ID
 */
export const getHashtagById = async (
  id: number,
  options: CacheOptions = { next: { revalidate: 43200 } }
): Promise<Hashtag | null> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API URL is not defined");
    }

    const response = await fetch(`${apiUrl}/hashtags/${id}`, {
      cache: options.cache,
      next: options.next,
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return transformHashtagResponse(result.data);
  } catch (error) {
    console.error('Error fetching hashtag by ID:', error);
    return null;
  }
};

/**
 * Search hashtags by name
 */
export const searchHashtags = async (
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<HashtagServiceResponse> => {
  try {
    // Note: This would require a search endpoint in the backend
    // For now, we'll fetch all and filter on frontend (not ideal for production)
    const allHashtags = await getAllHashtags(1, 100); // Fetch more for filtering
    
    const filteredData = allHashtags.data.filter(hashtag =>
      hashtag.name.toLowerCase().includes(query.toLowerCase())
    );

    // Simple pagination on filtered results
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      meta: {
        page,
        pageSize: limit,
        totalPages: Math.ceil(filteredData.length / limit),
        total: filteredData.length
      },
      message: 'Search results'
    };
  } catch (error) {
    console.error('Error searching hashtags:', error);
    return {
      data: [],
      meta: {
        page: 1,
        pageSize: limit,
        totalPages: 0,
        total: 0
      },
      message: 'Error searching hashtags'
    };
  }
};
