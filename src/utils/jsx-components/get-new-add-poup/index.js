/*
 * @Author       : ADI
 * @Date         : 2021-07-21 10:37:53
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-21 17:51:10
 */

import Vue from 'vue';
import poupBox from './components/poup-box/index.vue';

const getOrderBox = function(id) {
  const data = {
    selectOption: {
      showAddOrder: false,
      companyList: [],
      productType: [],
    },
    orderId: '',
    submitOption: {
      sid: '',
      productId: undefined,
      payType: 1,
      amount: '',
      totalPrice: '',
    },
    showOpt: {},
  };
  const vm = Vue.extend(poupBox);
  return new vm({
    data() {
      return Object.assign({}, data, { sid: id });
    },
  });
};

export const getNewAddPoup = {
  getOrderBox,
};
