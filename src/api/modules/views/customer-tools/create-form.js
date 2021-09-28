/*
 * @Author       : ADI
 * @Date         : 2021-07-01 16:50:44
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-01 16:51:43
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getFormTempEditInfo = data => {
  return POST_WRAP('/ajax/form/tsForm_h.jsp?cmd=getFormTempEditInfo', data);
};

export const saveTsFormTemp = data => {
  return POST_WRAP('/ajax/form/tsForm_h.jsp?cmd=saveTsFormTemp', data);
};
