import Vue from "vue";
import VueRouter from "vue-router";
import { constantRoutes } from "./routes";

Vue.use(VueRouter);

const routes = constantRoutes;
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  document.title=to.meta.title;
  const authentication = localStorage.getItem("authentication");
  if (!authentication) {
    // if there is no token redirect to login
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  } else{
    next()
  }
});

export default router;
