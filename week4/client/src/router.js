import Vue from "vue";
import Router from "vue-router";
import LandingPage    from "./views/LandingPage.vue";
import Login          from "./views/Login.vue";
import Register       from "./views/Register.vue";
import Dashboard      from "./views/Dashboard.vue";
import Materials      from "./views/Materials.vue";
import Orders         from "./views/Orders.vue";
import OrderTracking  from "./views/OrderTracking.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/",               name: "Home",          component: LandingPage   },
    { path: "/login",          name: "Login",         component: Login         },
    { path: "/register",       name: "Register",      component: Register      },
    { path: "/dashboard",      name: "Dashboard",     component: Dashboard     },
    { path: "/materials",      name: "Materials",     component: Materials     },
    { path: "/orders",         name: "Orders",        component: Orders        },
    { path: "/order-tracking", name: "OrderTracking", component: OrderTracking },
  ],
});
