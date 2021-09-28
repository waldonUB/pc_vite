/*
 * @Author       : ADI
 * @Date         : 2021-06-16 14:01:53
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 14:03:49
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const batchRevertFileOrDir = data => {
  return POST_WRAP('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=batchRevertFileOrDir', data);
};
