import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { Role } from '@/types/user'
import AppLayout from '@/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth.store'
import { guestRoutes } from '@/router/guest.routes'
import { adminRoutes } from '@/router/admin.routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/pages/LandingPage.vue'),
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('@/pages/SignInPage.vue'),
  },
  {
    path: '/',
    component: AppLayout,
    meta: { auth: true },
    children: guestRoutes,
  },
  {
    path: '/admin',
    component: AppLayout,
    meta: { auth: true, roles: ['admin'] },
    children: adminRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const { user, hasRole, homePath } = useAuthStore()

  const requiresAuth = to.meta.auth || false
  const requiresRoles = to.meta.roles as Role[]

  if (requiresAuth && !user.token) return '/sign-in'
  if (to.path === '/sign-in' && user.token) return homePath
  if (requiresRoles && !hasRole(requiresRoles)) return homePath
})

export default router
