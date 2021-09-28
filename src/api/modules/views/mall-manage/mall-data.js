/*
 * @Author       : ADI
 * @Date         : 2021-08-04 14:30:28
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:27:05
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const refreshOrder = data => {
  return POST_WRAP('/ajax/mall/tsMallOrder_h.jsp?cmd=refreshOrder', data);
};
