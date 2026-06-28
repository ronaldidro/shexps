import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    config: {
      preset: 'Aura',
      primary: 'emerald',
      surface: null as string | null,
      darkTheme: false,
      menuMode: 'static' as 'static' | 'overlay',
    },
  }),
  persist: true,
})
