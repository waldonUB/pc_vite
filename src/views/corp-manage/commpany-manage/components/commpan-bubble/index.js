/*
 * @Author       : ADI
 * @Date         : 2021-07-23 17:54:21
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 14:24:51
 */

import Component from './components/commpan-bubble.vue';
import Vue from 'vue';

const data = {
  form: {
    companyName: '',
  },
  isShow: false,
  linkTarget: null,
  companyId: -1,
  nowStyle: '',
  isAddType: false,
  companyNameRule: [], // 自定义校验
  bubbleDisabled: false,
};
const vm = Vue.extend(Component);

export default function() {
  return new vm({
    data() {
      return Object.assign({}, data);
    },
  });
}
