/*
 * @Author       : ADI
 * @Date         : 2021-08-04 13:52:13
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:27:16
 */

import Component from './components/custom-pay-detail.vue';
import Vue from 'vue';

const vm = Vue.extend(Component);

export default function() {
  return new vm();
}
