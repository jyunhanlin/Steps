import Vue from 'vue';
import Router from 'vue-router';
import Login from '../src/views/Login.vue';
import Steps from '../src/views/Steps.vue';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    alias: '/signin',
  },
  {
    path: '/steps',
    name: 'steps',
    component: Steps,
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

// router.beforeEach((to, from, next) => {
//   store.commit('sync');
//   if ((to.matched.some(record => record.meta.requiresAuth) && !store.getters.isAuth) ||
//       (to.matched.some(record => record.meta.requiresAdmin) && !store.getters.isAdmin)) {
//     store.commit('unauthorize');
//     next({ path: '/login', query: { redirect: to.fullPath } });
//   } else {
//     next();
//   }
// });


export default router;
