/*
 * @Author       : ADI
 * @Date         : 2021-04-21 17:44:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 15:44:10
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getTsPushConfDef = data => {
  return POST_WRAP('/ajax/push/tsPushConf_h.jsp?cmd=getTsPushConfDef', data);
};

export const checkOpenPush = data => {
  return POST_WRAP('/ajax/push/tsPushConf_h.jsp?cmd=checkOpenPush', data);
};

export const setTsProfExt = data => {
  return POST_WRAP('/ajax/push/tsPushConf_h.jsp?cmd=setTsProfExt', data);
};

export const checkOpenPushGET = params => {
  return GET_WRAP('/rest/manage/push/checkOpenPush', params);
};
