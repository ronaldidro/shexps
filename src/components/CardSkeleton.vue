<template>
  <div class="mb-5 flex items-center gap-2">
    <Skeleton width="1.2rem" height="1.2rem" />
    <Skeleton width="4rem" height="1rem" />
  </div>
  <div
    class="flex justify-between items-center mb-5 p-4 rounded-md bg-surface-0 dark:bg-surface-900 gap-4"
  >
    <Skeleton width="12rem" height="2rem" />
    <Skeleton width="6.5rem" height="2rem" />
  </div>
  <div
    class="flex justify-between items-center mb-5 p-4 rounded-md bg-surface-0 dark:bg-surface-900"
  >
    <Skeleton width="6rem" height="1.2rem" />
    <Skeleton width="1.2rem" height="1.2rem" />
  </div>
  <div class="card p-1!">
    <div v-for="i in 5" :key="i" class="mx-6 py-6" :class="{ 'border-t border-surface': i !== 1 }">
      <div class="flex justify-between items-center mb-3">
        <Skeleton width="8rem" height="0.8rem" />
        <Skeleton width="1rem" height="1.5rem" />
      </div>
      <div class="mb-3">
        <Skeleton width="5rem" height="1.5rem" />
      </div>
      <div class="mb-4">
        <Skeleton :width="i % 2 === 0 ? '60%' : '85%'" height="1rem" />
      </div>
      <div class="flex justify-between items-center mt-2">
        <Skeleton width="4.5rem" height="1.4rem" borderRadius="1rem" />
        <Skeleton width="6.5rem" height="1.4rem" borderRadius="1rem" />
      </div>
    </div>
  </div>
</template>
