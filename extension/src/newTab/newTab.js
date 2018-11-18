import Vue from 'vue';
import App from './App';
import * as authService from '../services/auth';

import './newTab.scss';

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

let app;
authService.checkAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      render: h => h(App),
    });
  }
});
