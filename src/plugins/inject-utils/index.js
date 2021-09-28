/*
 * @Author       : ADI
 * @Date         : 2021-05-25 11:15:54
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-24 11:56:10
 */

import { ActLog, FdpLog, checkHasFuncPermission, logDog, postMessage, showStaffName } from '@/utils';

import TsCommDef from '@/config/ts-comm-def';
import VurConstruction from 'vue';

const isProduction = process.env.NODE_ENV === 'production';
const hostCdn = process.env.VUE_APP_HOST + process.env.VUE_APP_BASE_URL;

export default {
  install(Vue, options) {
    Vue.prototype.$utils = {
      $eventBus: new VurConstruction(),
      fixedTableMaxHeight: 'auto',
      showStaffName, // 显示员工名称字段
      TsCommDef, // 公共定义
      checkHasFuncPermission, // 判断是否有功能权限
      logDog,
      FdpLog,
      ActLog,
      postMessage,
      host: isProduction ? hostCdn : location.origin,
    };
  },
};
