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
export declare const getPaginationParams: (query: any) => PaginationParams;
export declare const getPaginationMeta: (total: number, page: number, limit: number) => PaginationMeta;
