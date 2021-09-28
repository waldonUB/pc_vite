/*
 * @Author       : ADI
 * @Date         : 2021-04-14 14:22:59
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 13:47:02
 */

import { getCookie, getServerTime } from '@/utils';

import Vue from 'vue';
import { destroyInstance } from '../utils';
import store from '@/store';
import versionChangePopupVue from './components/index.vue';

const getStoreState = () => store.state;

export const versionChangePopup = () => {
  const data = {
    visible: true,
  };
  let instance;
  return new Promise(resolve => {
    instance && destroyInstance(instance);
    const currentTime = getServerTime(); // 获取当前服务器时间
    const startTime = new Date('2020-11-27 00:00:00').getTime();
    const endTime = new Date('2020-12-16 00:00:00').getTime();
    const checkTime = currentTime > startTime && currentTime < endTime;
    console.log(currentTime, 'checkTime---->', checkTime);
    if (
      !getStoreState().user.info.isOem &&
      checkTime &&
      !getCookie(`ts_versionChangePopup${getStoreState().globalData.userTicket}`)
    ) {
      const popupInfoConstructor = Vue.extend(versionChangePopupVue);
      const parentDOM = document.body;
      const popupInfoObj = new popupInfoConstructor({
        el: document.createElement('div'),
        data() {
          return Object.assign({}, data, { resolve });
        },
        store,
      });
      parentDOM.appendChild(popupInfoObj.$el);
    } else {
      resolve();
    }
  }).finally(() => {
    destroyInstance(instance);
  });
};
