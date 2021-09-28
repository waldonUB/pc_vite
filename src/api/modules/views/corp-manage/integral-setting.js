/*
 * @Author       : ADI
 * @Date         : 2021-07-20 14:42:29
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-20 14:43:29
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const setIntegralSettingInfo = data => {
  return POST_WRAP('/ajax/integral/tsIntegral_h.jsp?cmd=setIntegralSettingInfo', data);
};

export const getDictionaryInfo = data => {
  return POST_WRAP('/ajax/comm/tsDictionary_h.jsp?cmd=getDictionaryInfo', data);
};
