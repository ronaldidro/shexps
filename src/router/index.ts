import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";
import { useAuthStore } from "@/stores/auth.store";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/LoginPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "/",
        name: "dashboard",
        component: () => import("@/pages/DashboardPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/account",
        name: "account",
        component: () => import("@/pages/account/AccountPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/account/password",
        name: "password",
        component: () => import("@/pages/account/PasswordPage.vue"),
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
