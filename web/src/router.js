import Vue from 'vue';
import Router from 'vue-router';
import { auth } from './services/firebase';
import Login from '../src/views/Login.vue';
import Todo from '../src/views/Todo.vue';

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
    name: 'todo',
    component: Todo,
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

router.beforeEach((to, from, next) => {
  const { currentUser } = auth;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('/login');
  } else {
    next();
  }
});


export default router;
