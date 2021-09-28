/*
 * @Author       : ADI
 * @Date         : 2021-06-16 15:55:25
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 16:06:34
 */

import Vue from 'vue';
import { destroyInstance } from '../utils';
import getPricePoupVue from './components/index.vue';
import store from '@/store';

//开通弹窗
export const getPricePoup = function(page = '') {
  const data = {
    isShowPricePoup: false,
  };
  let instance;
  return new Promise(resolve => {
    instance && destroyInstance(instance);
    const getPricePoupConstructor = Vue.extend(getPricePoupVue);
    const parentDOM = document.body;
    instance = new getPricePoupConstructor({
      el: document.createElement('div'),
      data() {
        return Object.assign({}, data, { resolve });
      },
      store,
    });
    parentDOM.appendChild(instance.$el);
  }).finally(() => {
    destroyInstance(instance);
  });
};
