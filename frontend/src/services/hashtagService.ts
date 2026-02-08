import getData from "@/utils/getData";
import type {
  Hashtag,
  HashtagApiResponse,
  HashtagServiceResponse,
  CacheOptions,
  PaginationMeta
} from "@/types/hashtag.types";

/** Backend list meta shape (currentPage, limit) */
interface BackendListMeta {
  total: number;
  skip?: number;
  limit: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Transform API hashtag response to frontend hashtag format
 */
const transformHashtagResponse = (apiHashtag: HashtagApiResponse): Hashtag => {
  const slug =
    apiHashtag.slug ??
    apiHashtag.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

  return {
    id: apiHashtag.id,
    name: apiHashtag.name,
    slug,
    postCount: apiHashtag.postCount ?? 0,
    icon: '',
    description: `#${apiHashtag.name} etiketli ${apiHashtag.postCount ?? 0} yazı`,
  };
};

/** Normalize backend list meta to frontend PaginationMeta */
const normalizeListMeta = (
  meta: BackendListMeta | undefined,
  page: number,
  limit: number
): PaginationMeta => {
  if (!meta) {
    return { page: 1, pageSize: limit, totalPages: 0, total: 0 };
  }
  return {
    page: meta.currentPage ?? page,
    pageSize: meta.limit ?? limit,
    totalPages: meta.totalPages ?? 0,
    total: meta.total ?? 0,
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
    const skip = (page - 1) * limit;
    const response = await getData<HashtagApiResponse, BackendListMeta>(
      'hashtags',
      false,
      limit,
      page,
      skip,
      options
    );

    const transformedData = (response.data ?? []).map(transformHashtagResponse);
    const meta = normalizeListMeta(
      response.meta as BackendListMeta | undefined,
      page,
      limit
    );

    if (response.error) {
      return { data: [], meta, message: response.userMessage ?? response.message ?? 'Error fetching hashtags' };
    }

    return {
      data: transformedData,
      meta,
      message: response.message ?? 'Hashtags retrieved successfully',
    };
  } catch (error) {
    console.error('Error in getAllHashtags:', error);
    return {
      data: [],
      meta: { page: 1, pageSize: limit, totalPages: 0, total: 0 },
      message: 'Error fetching hashtags',
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
 * Search hashtags by name via GET /hashtags/search
 * Backend expects: term, skip, limit. Returns { data, count, message }.
 */
export const searchHashtags = async (
  query: string,
  page: number = 1,
  limit: number = 50
): Promise<HashtagServiceResponse> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('API URL is not defined');
    }

    const term = query.trim();
    if (!term) {
      return {
        data: [],
        meta: { page: 1, pageSize: limit, totalPages: 0, total: 0 },
        message: 'Search term is required',
      };
    }

    const skip = (page - 1) * limit;
    const params = new URLSearchParams({
      term: encodeURIComponent(term),
      skip: String(skip),
      limit: String(limit),
    });
    const url = `${apiUrl}/hashtags/search?${params.toString()}`;
    const response = await fetch(url, { next: { revalidate: 60 } });
    const json = await response.json();

    if (!response.ok) {
      const message = json?.message ?? 'Error searching hashtags';
      return {
        data: [],
        meta: { page: 1, pageSize: limit, totalPages: 0, total: 0 },
        message,
      };
    }

    const rawData = json.data ?? [];
    const count = Number(json.count) ?? 0;
    const transformedData = rawData.map((item: HashtagApiResponse) =>
      transformHashtagResponse(item)
    );
    const totalPages = limit > 0 ? Math.ceil(count / limit) : 0;

    return {
      data: transformedData,
      meta: {
        page,
        pageSize: limit,
        totalPages,
        total: count,
      },
      message: json.message ?? 'Search results',
    };
  } catch (error) {
    console.error('Error searching hashtags:', error);
    return {
      data: [],
      meta: { page: 1, pageSize: limit, totalPages: 0, total: 0 },
      message: 'Error searching hashtags',
    };
  }
};
