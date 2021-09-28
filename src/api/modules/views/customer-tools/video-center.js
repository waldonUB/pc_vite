/*
 * @Author       : ADI
 * @Date         : 2021-06-29 14:27:33
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 10:27:15
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const saveTsVideoInfo = data => {
  return POST_WRAP('/ajax/video/tsVideo_h.jsp?cmd=saveTsVideoInfo', data);
};

export const saveTsVideoTemplateInfo = data => {
  return POST_WRAP('/ajax/video/tsVideo_h.jsp?cmd=saveTsVideoTemplateInfo', data);
};

export const getTsHotVideoList = data => {
  return POST_WRAP('/ajax/video/tsVideo_h.jsp?cmd=getTsHotVideoList', data);
};

export const getTsVideoTemplateList = data => {
  return POST_WRAP('/ajax/video/tsVideo_h.jsp?cmd=getTsVideoTemplateList', data);
};

export const getTsVideoList = data => {
  return POST_WRAP('/ajax/video/tsVideo_h.jsp?cmd=getTsVideoList', data);
};

export const delTsVideoTemplate = data => {
  return POST_WRAP('/ajax/video/tsVideo_h.jsp?cmd=delTsVideoTemplate', data);
};

export const delTsVideo = data => {
  return POST_WRAP('/ajax/video/tsVideo_h.jsp?cmd=delTsVideo', data);
};

export const getTsWxWorkMaterialList = data => {
  return POST_WRAP('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=getTsWxWorkMaterialList', data);
};

export const batchAddVideoInfo = data => {
  return POST_WRAP('/ajax/video/tsVideo_h.jsp?cmd=batchAddVideoInfo', data);
};
