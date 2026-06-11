import type { Ref } from 'vue'

export interface PaginatedData<T> {
  data: T[]
  meta: {
    total: number
    page: number
    lastPage: number
  }
}

export interface QueryParams {
  search?: string
  group?: string
  user?: string
  startDate?: string
  endDate?: string
  page: number
  limit: number
}

export interface ScrollPaginationOptions<T> {
  el: Ref<HTMLElement | null>
  fetcher: (params: QueryParams) => Promise<PaginatedData<T>>
}
