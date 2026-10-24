import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { Role } from '@/types/user'
import AppLayout from '@/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth.store'

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
    path: '/_layout',
    component: AppLayout,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: { auth: true },
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('@/pages/UsersPage.vue'),
        meta: { auth: true, roles: ['admin'] },
      },
      {
        path: '/expenses/new',
        name: 'new-expense',
        component: () => import('@/pages/expenses/ExpensePage.vue'),
        meta: { auth: true },
      },
      {
        path: '/expenses/:id?',
        name: 'expenses',
        component: () => import('@/pages/expenses/ExpensesPage.vue'),
        meta: { auth: true },
      },
      {
        path: '/payments/new',
        name: 'new-payment',
        component: () => import('@/pages/payments/PaymentPage.vue'),
        meta: { auth: true },
      },
      {
        path: '/payments/:id?',
        name: 'payments',
        component: () => import('@/pages/payments/PaymentsPage.vue'),
        meta: { auth: true },
      },
      {
        path: '/groups',
        name: 'groups',
        component: () => import('@/pages/groups/GroupsPage.vue'),
        meta: { auth: true },
      },
      {
        path: '/groups/:id',
        name: 'group',
        component: () => import('@/pages/groups/GroupPage.vue'),
        meta: { auth: true },
      },
      {
        path: '/account',
        name: 'account',
        component: () => import('@/pages/AccountPage.vue'),
        meta: { auth: true },
      },
      {
        path: '/notifications',
        name: 'notifications',
        component: () => import('@/pages/NotificationsPage.vue'),
        meta: { auth: true },
      },
    ],
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
  const { user, hasRole } = useAuthStore()
  const requiresAuth = to.meta.auth || false
  const requiresRoles = to.meta.roles as Role[]

  if (requiresAuth && !user.token) return '/sign-in'

  if (to.path === '/sign-in' && user.token) return '/dashboard'

  if (requiresRoles && !hasRole(requiresRoles)) return '/dashboard'
})

export default router
