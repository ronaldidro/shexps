import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const useNavItems = () => {
  const route = useRoute()

  const items = [
    { label: 'Resumen', icon: 'pi pi-fw pi-chart-bar', to: '/dashboard' },
    { label: 'Gastos', icon: 'pi pi-fw pi-dollar', to: '/expenses' },
    { label: 'Pagos', icon: 'pi pi-fw pi-wallet', to: '/payments' },
    { label: 'Grupos', icon: 'pi pi-fw pi-users', to: '/groups' },
    { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/account' },
  ]

  const getActivePath = (path: string) => {
    const match = items.find((item) => path === item.to || path.startsWith(`${item.to}/`))
    return match?.to ?? '/'
  }

  const activeTab = computed(() => getActivePath(route.path))

  return { items, activeTab }
}
