export interface PaginationParams {
    skip: number;
    limit: number;
  }
  
  export interface SearchParams {
    term?: string;
    hashtag?: string;
    pagination: PaginationParams;
  }
  
  export interface SearchResult<T> {
    data: T[];
    count: number;
  }
  