/*
 * @Author       : ADI
 * @Date         : 2021-04-21 16:40:47
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-21 16:42:21
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const addTsPushRecord = data => {
  return POST_WRAP('/ajax/push/tsPushRecord_h.jsp?cmd=addTsPushRecord', data);
};

export const getVaildedTsPushConf = data => {
  return POST_WRAP('/ajax/push/tsPushConf_h.jsp?cmd=getVaildedTsPushConf', data);
};
