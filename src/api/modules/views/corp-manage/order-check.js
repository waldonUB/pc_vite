/*
 * @Author       : ADI
 * @Date         : 2021-07-20 17:10:24
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-22 10:58:32
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getOrderDefList = data => {
  return POST_WRAP('/ajax/order/tsOrder_h.jsp?cmd=getOrderDefList', data);
};

export const delOrder = data => {
  return POST_WRAP('/ajax/order/tsOrder_h.jsp?cmd=delOrder', data);
};

export const auditTsOrder = data => {
  return POST_WRAP('/ajax/order/tsOrder_h.jsp?cmd=auditTsOrder', data);
};

export const getBkge = data => {
  return POST_WRAP('/ajax/order/tsOrder_h.jsp?cmd=getBkge', data);
};

export const getTsProductList = data => {
  return POST_WRAP('/ajax/product/tsProduct_h.jsp?cmd=getTsProductList', data);
};

export const getTsClientByMobile = data => {
  return POST_WRAP('/rest/manage/client/getTsClientByMobile', data);
};

export const getTsCompanyList = data => {
  return POST_WRAP('/ajax/company/tsCompany_h.jsp?cmd=getTsCompanyList&isGetAll=true', data);
};

export const addTsOrder = data => {
  return POST_WRAP('/ajax/order/tsOrder_h.jsp?cmd=addTsOrder', data);
};

export const getTsOrder = data => {
  return POST_WRAP('/ajax/order/tsOrder_h.jsp?cmd=getTsOrder', data);
};

export const updateTsOrder = data => {
  return POST_WRAP('/ajax/order/tsOrder_h.jsp?cmd=updateTsOrder', data);
};

export const getTsOrderItemList = data => {
  return POST_WRAP('/ajax/order/tsOrder_h.jsp?cmd=getTsOrderItemList', data);
};
