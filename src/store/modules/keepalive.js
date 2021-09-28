/*
 * @Author       : ADI
 * @Date         : 2021-07-22 15:01:42
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-22 15:23:20
 */

import { needKeepAliveComponentNameList } from '../config';

export default {
  namespaced: true,
  state: {
    // 需要keep-alive的组件名称
    keepLiveList: [...needKeepAliveComponentNameList],
  },
  getters: {},
  mutations: {
    ADD_KEEPLIVE_ITEM(state, item) {
      if (state.keepLiveList.includes(item)) return;
      state.keepLiveList.push(item);
    },
    REMOVE_KEEPLIVE_ITEM(state, item) {
      const index = state.keepLiveList.indexOf(item);
      index > -1 && state.keepLiveList.splice(index, 1);
    },
    DEL_ALL_KEEPLIVE_ITEM(state, isReset = true) {
      let list = [];
      if (isReset) {
        list = needKeepAliveComponentNameList;
      }
      state.keepLiveList = list;
    },
  },
  actions: {},
};
