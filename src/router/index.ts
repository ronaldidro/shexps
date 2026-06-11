import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth.store'

const routes = [
  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('@/pages/SignInPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'expenses',
        name: 'expenses',
        component: () => import('@/pages/expenses/ExpensesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'expenses/new',
        name: 'new-expense',
        component: () => import('@/pages/expenses/ExpensePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'debts',
        name: 'debts',
        component: () => import('@/pages/DebtsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'payments',
        name: 'payments',
        component: () => import('@/pages/payments/PaymentsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'payments/new',
        name: 'new-payment',
        component: () => import('@/pages/payments/PaymentPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'groups',
        name: 'groups',
        component: () => import('@/pages/groups/GroupsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'groups/:id',
        name: 'group',
        component: () => import('@/pages/groups/GroupPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('@/pages/account/AccountPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'account/password',
        name: 'password',
        component: () => import('@/pages/account/PasswordPage.vue'),
        meta: { requiresAuth: true },
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
  const { user } = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !user.token) return '/sign-in'

  if (to.path === '/sign-in' && user.token) return '/'
})

export default router
