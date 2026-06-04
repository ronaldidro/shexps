import type { Ref } from "vue";

export interface PaginatedData<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface QueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ScrollPaginationOptions<T> {
  el: Ref<HTMLElement | null>;
  limit?: number;
  distance?: number;
  filters?: QueryParams;
  fetcher: (params: QueryParams) => Promise<PaginatedData<T>>;
}
