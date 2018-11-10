import Vue from 'vue';
import VueFire from 'vuefire';
import { setupCalendar, Calendar } from 'v-calendar';
import 'v-calendar/lib/v-calendar.min.css';

import App from './App.vue';
import router from './router';
// import store from './store';
import * as authService from './services/auth';


import './styles/main.scss';

Vue.use(VueFire);


// Remember to setup calendar (passing in defaults if needed)
setupCalendar({
  firstDayOfWeek: 1,
});

// Register component(s)
Vue.component('v-calendar', Calendar);

Vue.config.productionTip = false;

let app;
authService.checkAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      // store,
      render: h => h(App),
    }).$mount('#app');
  }
});

