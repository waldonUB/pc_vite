/*
 * @Author       : ADI
 * @Date         : 2021-03-22 11:37:09
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-09 16:57:51
 */

import 'babel-polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
import './plugins/fai-component';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/utils';
import './icons'; // icon
import injectUtils from '@/plugins/inject-utils';
import pubsub from '@/plugins/pubsub';

import * as filters from '@/filters';
import * as directives from '@/directives';

// 全局组件注册
import './components/global';

// 全局导航守卫
import './router/navigationGuard';

// 引入第三方库或组件
import elementUIPlugins from './plugins/element-ui';

// register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]);
});
// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.errorHandler = err => {
  console.error(err);
};

Vue.use(Vuex);
Vue.use(elementUIPlugins);
Vue.use(injectUtils);
Vue.use(pubsub);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
