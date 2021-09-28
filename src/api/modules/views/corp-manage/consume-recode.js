/*
 * @Author       : ADI
 * @Date         : 2021-07-29 16:39:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 13:57:56
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const refundTsOrderItem = data => {
  return POST_WRAP('/ajax/order/tsOrder_h.jsp?cmd=refundTsOrderItem', data);
};
