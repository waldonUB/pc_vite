/*
 * @Author       : ADI
 * @Date         : 2021-04-29 09:41:35
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-18 15:39:42
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const functionSettingSaveTsConf = data => {
  return POST_WRAP('/ajax/conf/tsConf_h.jsp?cmd=saveTsConf', data);
};

export const getTsConf = data => {
  return POST_WRAP('/ajax/conf/tsConf_h.jsp?cmd=getTsConf', data);
};

export const getTsTypeConf = data => {
  return POST_WRAP('/rest/manage/article/library/getTsTypeConf', data);
};

export const getTypeList = data => {
  return POST_WRAP('/rest/manage/article/library/getTypeList', data);
};

export const saveTsTypeConf = data => {
  return POST_WRAP('/rest/manage/article/library/saveTsTypeConf', data);
};
