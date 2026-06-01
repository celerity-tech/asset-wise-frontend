export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

/** Pagination metadata returned alongside a page of records. */
export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

/** Envelope for server-paginated list endpoints: a page of `data` plus `meta`. */
export interface PaginatedApiResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  meta: PageMeta;
}