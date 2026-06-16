import Vue from "vue";
import Router from "vue-router";
import LandingPage    from "./views/LandingPage.vue";
import Login          from "./views/Login.vue";
import Register       from "./views/Register.vue";
import Dashboard      from "./views/Dashboard.vue";
import Materials      from "./views/Materials.vue";
import Orders         from "./views/Orders.vue";
import OrderTracking  from "./views/OrderTracking.vue";
import ForgotPassword from "./views/ForgotPassword.vue";
import ResetPassword  from "./views/ResetPassword.vue";
import GoogleCallback from "./views/GoogleCallback.vue";
import AdminUsers     from "./views/AdminUsers.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/",                        name: "Home",          component: LandingPage   },
    { path: "/login",                   name: "Login",         component: Login         },
    { path: "/register",                name: "Register",      component: Register      },
    { path: "/dashboard",               name: "Dashboard",     component: Dashboard,     meta: { requiresAuth: true } },
    { path: "/materials",               name: "Materials",     component: Materials,     meta: { requiresAuth: true } },
    { path: "/orders",                  name: "Orders",        component: Orders,        meta: { requiresAuth: true } },
    { path: "/order-tracking",          name: "OrderTracking", component: OrderTracking, meta: { requiresAuth: true } },
    { path: "/forgot-password",         name: "ForgotPassword",  component: ForgotPassword  },
    { path: "/reset-password/:token",   name: "ResetPassword",   component: ResetPassword   },
    { path: "/auth/google/callback",    name: "GoogleCallback",  component: GoogleCallback  },
    { path: "/admin/users",             name: "AdminUsers",      component: AdminUsers,     meta: { requiresAuth: true, requiresAdmin: true } },
  ],
});

router.beforeEach((to, from, next) => {
  const raw = localStorage.getItem('mv_user');
  if (to.meta.requiresAuth && !raw) {
    return next('/login');
  }
  if (to.meta.requiresAdmin) {
    const user = raw ? JSON.parse(raw) : null;
    if (!user || user.role !== 'admin') return next('/dashboard');
  }
  next();
});

export default router;
