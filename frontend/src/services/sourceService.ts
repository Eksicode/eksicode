import getData from "@/utils/getData";

export interface Hashtag {
  id: number;
  name: string;
}

export interface Source {
  id: number;
  title: string;
  description: string;
  url: string;
  tgChannel: string | null;
  tgUser: string | null;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Hashtag[];
}

export interface BackendSourcesMeta {
  total: number;
  skip: number;
  limit: number;
  currentPage: number;
  totalPages: number;
}

export interface SourcesMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export interface SourcesServiceResponse {
  data: Source[];
  meta: SourcesMeta;
  message: string;
}

/**
 * Fetch all sources from the API
 */
export const getAllSources = async (
  page: number = 1,
  limit: number = 10,
  options?: any
): Promise<SourcesServiceResponse> => {
  try {
    const response = await getData<Source, BackendSourcesMeta>(
      'sources',
      false, // summaryOnly
      limit,
      page,
      undefined, // skip (calculated in backend)
      options
    );

    return {
      data: response.data,
      meta: {
        page: response.meta.currentPage,
        pageSize: response.meta.limit,
        totalPages: response.meta.totalPages,
        total: response.meta.total
      },
      message: response.message || 'Sources fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching sources:', error);
    return {
      data: [],
      meta: {
        page: 1,
        pageSize: limit,
        totalPages: 0,
        total: 0
      },
      message: 'Error fetching sources'
    };
  }
};

/**
 * Search sources by query
 */
export const searchSources = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<SourcesServiceResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sources/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 } // 5 minutes cache for search results
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      data: data.data || [],
      meta: {
        page: data.meta?.currentPage || page,
        pageSize: data.meta?.limit || limit,
        totalPages: data.meta?.totalPages || 0,
        total: data.meta?.total || 0
      },
      message: data.message || 'Search completed'
    };
  } catch (error) {
    console.error('Error searching sources:', error);
    return {
      data: [],
      meta: {
        page: 1,
        pageSize: limit,
        totalPages: 0,
        total: 0
      },
      message: 'Error searching sources'
    };
  }
};
