/*
 * @Author       : ADI
 * @Date         : 2021-06-30 16:07:29
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 16:09:13
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getTempSelectList = data => {
  return POST_WRAP('/ajax/form/tsForm_h.jsp?cmd=getTempSelectList', data);
};

export const operationTemp = data => {
  return POST_WRAP('/ajax/form/tsForm_h.jsp?cmd=operationTemp', data);
};
