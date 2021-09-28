/*
 * @Description  : 积分相关的 api
 * @Author       : turbo
 * @Date         : 2021-05-28 11:17:09
 * @LastEditors  : turbo
 * @LastEditTime : 2021-05-28 11:25:52
 */

import { POST_WRAP, GET_WRAP } from '@/utils';

export function getIntegralInfo() {
  return POST_WRAP('/ajax/integral/tsIntegral_h.jsp?cmd=getIntegralInfo');
}

export function setIntegralSettingInfo(data) {
  return POST_WRAP('/ajax/integral/tsIntegral_h.jsp?cmd=setIntegralSettingInfo', data);
}
