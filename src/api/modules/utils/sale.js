/*
 * @Author       : ADI
 * @Date         : 2021-05-13 17:11:32
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-14 15:34:12
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const getCrmServiceCode = data => {
  return POST_WRAP('/ajax/index/index_h.jsp?cmd=getCrmServiceCode', data);
};

// 获取点单和优惠卷数
export const getOrderInfo = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=getOrderInfo', data);
};
