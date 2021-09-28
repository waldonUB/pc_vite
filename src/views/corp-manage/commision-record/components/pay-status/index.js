/*
 * @Author       : ADI
 * @Date         : 2021-07-23 15:01:28
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-23 15:19:57
 */

import Component from './components/pay-status.vue';
import Vue from 'vue';

const data = {
  form: {
    id: 0,
    status: 0,
  },
  isShow: true,
  linkTarget: null,
  nowStyle: '',
  payStatusArr: { 1: '支付成功', 0: '未支付' },
};
const vm = Vue.extend(Component);

export default function() {
  return new vm({
    data() {
      return Object.assign({}, data);
    },
  });
}
