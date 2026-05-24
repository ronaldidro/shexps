import { ref, onMounted, type Ref } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import type { PaginatedData, PaginationParams } from "@/types/pagination";

interface ScrollPaginationOptions<T> {
  el: Ref<HTMLElement | null>;
  limit?: number;
  distance?: number;
  fetcher: (params: PaginationParams) => Promise<PaginatedData<T>>;
}

export function useScrollPagination<T>({
  el,
  fetcher,
  limit = 10,
  distance = 10,
}: ScrollPaginationOptions<T>) {
  const items: Ref = ref<T[]>([]);
  const page = ref(1);
  const loading = ref(false);
  const hasMore = ref(true);

  const loadPage = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;

    try {
      const response = await fetcher({ page: page.value, limit });

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

  onMounted(loadPage);

  useInfiniteScroll(el, loadPage, {
    distance,
    canLoadMore: () => hasMore.value && !loading.value,
  });

  return {
    items,
    loading,
    reload,
  };
}
