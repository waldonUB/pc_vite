/*
 * @Author       : ADI
 * @Date         : 2021-07-30 14:05:42
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 14:27:19
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const setTsProductStatus = data => {
  return POST_WRAP('/ajax/product/tsProduct_h.jsp?cmd=setTsProductStatus', data);
};

export const setTsProduct = data => {
  return POST_WRAP('/ajax/product/tsProduct_h.jsp?cmd=setTsProduct', data);
};

export const addTsProduct = data => {
  return POST_WRAP('/ajax/product/tsProduct_h.jsp?cmd=addTsProduct', data);
};

export const getTsCompanyList = data => {
  return POST_WRAP('/ajax/company/tsCompany_h.jsp?cmd=getTsCompanyList&isGetAll=true', data);
};

export const getTsProduct = data => {
  return POST_WRAP('/ajax/product/tsProduct_h.jsp?cmd=getTsProduct', data);
};

export const delTsProduct = data => {
  return POST_WRAP('/ajax/product/tsProduct_h.jsp?cmd=delTsProduct', data);
};
