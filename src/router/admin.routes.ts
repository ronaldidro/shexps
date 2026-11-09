import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'dashboard-admin',
    component: () => import('@/pages/admin/DashboardPage.vue'),
  },
  {
    path: 'users',
    name: 'users-admin',
    component: () => import('@/pages/admin/UsersPage.vue'),
  },
]
