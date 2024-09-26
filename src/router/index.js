import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "record",
      component: () => import("../views/record.vue"),
    },
    {
      path: "/add",
      name: "add",
      component: () => import("../views/add.vue"),
    },
    {
      path: "/details",
      name: "details",
      component: () => import("../views/details.vue"),
    },
    {
      path: "/analysis",
      name: "analysis",
      component: () => import("../views/analysis.vue"),
    },
  ],
});

export default router;
