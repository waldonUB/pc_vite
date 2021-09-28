/*
 * @Author       : ADI
 * @Date         : 2021-07-29 13:58:29
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 14:27:39
 */

import Component from './components/change-bk-type.vue';
import Vue from 'vue';

const data = {
  poupUpInfo: {
    bkgeStatus: 1,
    id: -1,
  },
  payTypeList: [],
  linkTarget: null,
  isShow: false,
  nowStyle: '',
  parent: null,
};
const vm = Vue.extend(Component);

export default function() {
  return new vm({
    data() {
      return Object.assign({}, data);
    },
  });
}
