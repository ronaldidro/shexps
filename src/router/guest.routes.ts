import type { RouteRecordRaw } from 'vue-router'

export const guestRoutes: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
  },
  {
    path: 'expenses/new',
    name: 'new-expense',
    component: () => import('@/pages/expenses/ExpensePage.vue'),
  },
  {
    path: 'expenses/:id?',
    name: 'expenses',
    component: () => import('@/pages/expenses/ExpensesPage.vue'),
  },
  {
    path: 'payments/new',
    name: 'new-payment',
    component: () => import('@/pages/payments/PaymentPage.vue'),
  },
  {
    path: 'payments/:id?',
    name: 'payments',
    component: () => import('@/pages/payments/PaymentsPage.vue'),
  },
  {
    path: 'groups',
    name: 'groups',
    component: () => import('@/pages/groups/GroupsPage.vue'),
  },
  {
    path: 'groups/:id',
    name: 'group',
    component: () => import('@/pages/groups/GroupPage.vue'),
  },
  {
    path: 'account',
    name: 'account',
    component: () => import('@/pages/AccountPage.vue'),
  },
  {
    path: 'notifications',
    name: 'notifications',
    component: () => import('@/pages/NotificationsPage.vue'),
  },
]
