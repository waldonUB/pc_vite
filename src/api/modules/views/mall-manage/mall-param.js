/*
 * @Author       : ADI
 * @Date         : 2021-08-03 19:37:30
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:14:59
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const saveProp = data => {
  return POST_WRAP('/ajax/product/tsProductProp_h.jsp?cmd=saveProp', data);
};

export const getProp = data => {
  return POST_WRAP('/ajax/product/tsProductProp_h.jsp?cmd=getProp', data);
};

export const updateSort = data => {
  return POST_WRAP('/ajax/product/tsProductProp_h.jsp?cmd=updateSort', data);
};

export const switchStatus = data => {
  return POST_WRAP('/ajax/product/tsProductProp_h.jsp?cmd=switchStatus', data);
};

export const delProp = data => {
  return POST_WRAP('/ajax/product/tsProductProp_h.jsp?cmd=delProp', data);
};
