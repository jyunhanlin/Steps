import Vue from 'vue';
import Router from 'vue-router';
// import Login from '../src/views/Login.vue';
import SignUp from '../src/views/SignUp.vue';
import Main from '../src/views/Main.vue';

Vue.use(Router);

const routes = [
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: Login,
  //   alias: '/signin',
  // },
  {
    path: '/signup',
    name: 'singup',
    component: SignUp,
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
