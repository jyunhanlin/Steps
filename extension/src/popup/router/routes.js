import PageIndex from './pages/Index';
import Login from './pages/Login';
import Todos from './pages/Todos';

export default [
  {
    path: '/',
    component: PageIndex,
    redirect: '/todos',
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'todos',
        component: Todos,
        meta: { requiresAuth: true },
      },
    ],
  },
];
