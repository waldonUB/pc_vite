/*
 * @Author       : ADI
 * @Date         : 2021-07-23 15:01:58
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-23 15:44:30
 */

import Component from './components/commision.vue';
import Vue from 'vue';

const data = {
  dataInfo: {},
  isShow: true,
  isDisabled: true,
};
const vm = Vue.extend(Component);

export default function() {
  return new vm({
    data() {
      return Object.assign({}, data);
    },
  });
}
