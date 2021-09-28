/*
 * @Author: ADI
 * @Date: 2021-03-30 11:09:34
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 15:26:27
 */

import Vue from 'vue';
import { destroyInstance } from '../utils';
import getOpenPoupVue from './components/index.vue';
import store from '@/store';

//开通弹窗
export const getOpenPoup = function(page = '') {
  const data = {
    isShowOpen: false, //显示开通弹窗
    isOnlyIndustryPush: false,
    buttonStatus: 0, //1，立即使用；2，暂不需要
    oldSelectList: {
      salesChannels: {
        title: '主要销售渠道',
        list: [],
      },
      teamSize: {
        title: '销售团队规模',
        list: [],
      },
    },
    selectList: {
      industry: {
        title: '您所处行业',
        list: [],
      },
    },
    resultObj: {
      industry: 0,
      salesChannels: 0,
      teamSize: 0,
    },
    corpInstallDialogVisible: false,
    isShowWxWorkPush: false,
  };
  let instance;
  return new Promise(resolve => {
    instance && destroyInstance(instance);
    const getOpenPoupConstructor = Vue.extend(getOpenPoupVue);
    const parentDOM = document.body;
    instance = new getOpenPoupConstructor({
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
