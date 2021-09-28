/*
 * @Author       : ADI
 * @Date         : 2021-07-13 17:55:25
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 18:07:38
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getTsConf = data => {
  return POST_WRAP('/ajax/conf/tsConf_h.jsp?cmd=getTsConf', data);
};

export const getTsTypeConf = data => {
  return POST_WRAP('/rest/manage/article/library/getTsTypeConf', data);
};

export const saveTsConf = data => {
  return POST_WRAP('/ajax/conf/tsConf_h.jsp?cmd=saveTsConf', data);
};

export const saveTsCardModule = data => {
  return POST_WRAP('/rest/manage/card/saveTsCardModule', data);
};

export const getTsCardModule = data => {
  return POST_WRAP('/rest/manage/card/getTsCardModule', data);
};

export const getTypeList = data => {
  return POST_WRAP('/rest/manage/article/library/getTypeList', data);
};

export const saveTsTypeConf = data => {
  return POST_WRAP('/rest/manage/article/library/saveTsTypeConf', data);
};

export const setTsProfConf = data => {
  return POST_WRAP('/rest/manage/prof/setTsProfConf', data);
};

export const getTsViewerConf = data => {
  return POST_WRAP('/ajax/viewer/tsViewerConf_h.jsp?cmd=getTsViewerConf', data);
};

export const saveTsViewerConfForWxAuth = data => {
  return POST_WRAP('/ajax/viewer/tsViewerConf_h.jsp?cmd=saveTsViewerConfForWxAuth', data);
};

export const getMaterialResInfo = data => {
  return POST_WRAP('/rest/manage/material/getMaterialResInfo', data);
};
