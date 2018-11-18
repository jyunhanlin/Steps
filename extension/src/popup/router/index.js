import Vue from 'vue';
import VueRouter from 'vue-router';
import { auth } from '../../services/firebase';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
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
