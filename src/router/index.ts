import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "@/pages/DashboardPage.vue";
import AccountPage from "@/pages/AccountPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import AppLayout from "@/layout/AppLayout.vue";
import { useAuthStore } from "@/stores/auth.store";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "/",
        name: "dashboard",
        component: DashboardPage,
        meta: { requiresAuth: true },
      },
      {
        path: "/account",
        name: "account",
        component: AccountPage,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !authStore.token) return "/login";

  if (to.path === "/login" && authStore.token) return "/";
});

export default router;
