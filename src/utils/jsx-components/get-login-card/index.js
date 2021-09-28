/*
 * @Author       : ADI
 * @Date         : 2021-04-13 17:53:00
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-14 14:01:08
 */
import Vue from 'vue';
import getLoginCardVue from './components/index.vue';
import store from '@/store';
import { destroyInstance } from '../utils';

export const getLoginCard = function() {
  //登录卡片弹窗
  const data = {
    showLoginCard: false, //显示登陆卡片
    loginCardType: -1, //登录卡片类型:1:说明卡片 2:系统卡片
    cardStep: 0, //卡片步骤
    imgs: [], //系统说明卡片
    cardId: -1, //卡片弹窗id
  };
  let instance;
  return new Promise(resolve => {
    instance && destroyInstance(instance);
    const getLoginCardConstructor = Vue.extend(getLoginCardVue);
    const parentDOM = document.body;
    instance = new getLoginCardConstructor({
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
