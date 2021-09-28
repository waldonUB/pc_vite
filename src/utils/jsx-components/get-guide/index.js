/*
 * @Author: ADI
 * @Date: 2021-03-29 16:52:55
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-14 14:01:19
 */
import Vue from 'vue';
import guideVue from './components/index.vue';
import store from '@/store';
import { destroyInstance } from '../utils';

// 弹窗指引组件
export const getGuide = function(params = {}) {
  const data = {
    showGuide: false, //是否有指引
    guideList: {},
    pageSet: {},
    isArticleModel: false, //是否是文章模板(需要分小步判断)
    smallStep: 0,
    step: 0,
    page: '',
    QRUrl: '', //二维码图片
    showBtypeTip: '',
  };
  let instance;
  return new Promise(resolve => {
    instance && destroyInstance(instance);
    const guideConstructor = Vue.extend(guideVue);
    const parentDOM = params.target ? params.target : document.body;
    instance = new guideConstructor({
      el: document.createElement('div'),
      data() {
        return Object.assign({}, data, params, { resolve });
      },
      store,
    });
    parentDOM.appendChild(instance.$el);
  }).finally(() => {
    destroyInstance(instance);
  });
};
