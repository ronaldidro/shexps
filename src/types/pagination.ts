export interface PaginatedData<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
