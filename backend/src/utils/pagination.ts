export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
  }
  
  export interface PaginationMeta {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
  }
  
  export const getPaginationParams = (query: any): PaginationParams => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;
  
    return { page, limit, skip };
  };
  
  export const getPaginationMeta = (
    total: number,
    page: number,
    limit: number
  ): PaginationMeta => ({
    page,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
    total,
  });
  