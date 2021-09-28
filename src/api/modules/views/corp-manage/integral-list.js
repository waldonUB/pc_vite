/*
 * @Author       : ADI
 * @Date         : 2021-07-20 13:42:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-20 13:51:23
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const setTsProfConf = data => {
  return POST_WRAP('/rest/manage/prof/setTsProfConf', data);
};

export const getIntegralDetailStatList = data => {
  return POST_WRAP('/ajax/integral/tsIntegralDetail_h.jsp?cmd=getIntegralDetailStatList', data);
};
