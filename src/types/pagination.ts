export interface PaginatedData<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
