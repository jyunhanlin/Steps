import Vue from 'vue';
import App from './App';
import router from './router';

import './popup.scss';

global.browser = require('webextension-polyfill');

Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // store,
  router,
  render: h => h(App),
});
