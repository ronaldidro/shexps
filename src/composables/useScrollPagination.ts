import { ref, type Ref } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import type { QueryParams, ScrollPaginationOptions } from "@/types/pagination";

export async function useScrollPagination<T>({
  el,
  fetcher,
}: ScrollPaginationOptions<T>) {
  const items: Ref = ref<T[]>([]);
  const loading = ref(false);
  const hasMore = ref(true);
  const query = ref<QueryParams>({ page: 1, limit: 10 });

  const loadPage = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;

    try {
      const response = await fetcher({
        ...query.value,
        page: query.value.page,
      });

      items.value.push(...response.data);

      hasMore.value = response.meta.page < response.meta.lastPage;

      query.value.page++;
    } finally {
      loading.value = false;
    }
  };

  const reload = async (params: QueryParams = { page: 1, limit: 10 }) => {
    items.value = [];
    query.value = params;
    hasMore.value = true;
    await loadPage();
  };

  const setFilters = async (filters: Partial<QueryParams>) =>
    await reload({ ...query.value, page: 1, ...filters });

  useInfiniteScroll(el, loadPage, {
    distance: 10,
    canLoadMore: () => hasMore.value && !loading.value,
  });

  return { items, loading, reload, setFilters };
}
