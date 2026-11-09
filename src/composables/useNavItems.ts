import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export const useNavItems = () => {
  const route = useRoute()
  const { hasRole } = useAuthStore()
  const basePath = hasRole(['admin']) ? '/admin' : ''

  let items = [{ label: 'Resumen', icon: 'pi pi-fw pi-chart-bar', to: `${basePath}/dashboard` }]

  if (hasRole(['admin']))
    items = [...items, { label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/admin/users' }]

  items = [
    ...items,
    { label: 'Gastos', icon: 'pi pi-fw pi-dollar', to: `${basePath}/expenses` },
    { label: 'Pagos', icon: 'pi pi-fw pi-wallet', to: `${basePath}/payments` },
    { label: 'Grupos', icon: 'pi pi-fw pi-objects-column', to: `${basePath}/groups` },
    { label: 'Perfil', icon: 'pi pi-fw pi-user', to: `${basePath}/account` },
  ]

  const getActivePath = (path: string) => {
    const match = items.find((item) => path === item.to || path.startsWith(`${item.to}/`))
    return match?.to ?? '/'
  }

  const activeTab = computed(() => getActivePath(route.path))

  return { items, activeTab }
}
