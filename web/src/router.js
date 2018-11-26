import Vue from 'vue';
import Router from 'vue-router';
import Login from '../src/views/Login.vue';
import Main from '../src/views/Main.vue';

Vue.use(Router);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    alias: '/signin',
  },
  {
    path: '/',
    name: 'main',
    component: Main,
    meta: { requiresAuth: true },
  },
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

export default router;
