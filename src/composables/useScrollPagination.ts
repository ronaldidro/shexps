import { ref, type Ref } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import type { QueryParams, ScrollPaginationOptions } from "@/types/pagination";

export async function useScrollPagination<T>({
  el,
  fetcher,
  filters = { limit: 10 },
  distance = 10,
}: ScrollPaginationOptions<T>) {
  const items: Ref = ref<T[]>([]);
  const page = ref(1);
  const loading = ref(false);
  const hasMore = ref(true);
  const query = ref<QueryParams>({ ...filters });

  const loadPage = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;

    try {
      const response = await fetcher({
        ...query.value,
        page: page.value,
      });

      items.value.push(...response.data);

      hasMore.value = response.meta.page < response.meta.lastPage;

      page.value++;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    items.value = [];
    page.value = 1;
    hasMore.value = true;
  };

  const reload = async () => {
    reset();
    await loadPage();
  };

  const setFilters = async (filters: Partial<QueryParams>) => {
    query.value = { ...query.value, ...filters };
    await reload();
  };

  await loadPage();

  useInfiniteScroll(el, loadPage, {
    distance,
    canLoadMore: () => hasMore.value && !loading.value,
  });

  return {
    items,
    loading,
    reload,
    setFilters,
  };
}
