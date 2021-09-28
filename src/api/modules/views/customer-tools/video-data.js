/*
 * @Author       : ADI
 * @Date         : 2021-06-30 14:14:36
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 14:33:02
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getTsVideoDataList = data => {
  return POST_WRAP('/ajax/video/tsVideo_h.jsp?cmd=getTsVideoDataList', data);
};
