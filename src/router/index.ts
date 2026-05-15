import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "@/pages/DashboardPage.vue";
import AccountPage from "@/pages/AccountPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import AppLayout from "@/layout/AppLayout.vue";

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
  const token = localStorage.getItem("access_token");
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !token) return "/login";

  if (to.path === "/login" && token) return "/";
});

export default router;
