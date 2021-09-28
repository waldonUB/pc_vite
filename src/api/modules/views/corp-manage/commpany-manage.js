/*
 * @Author       : ADI
 * @Date         : 2021-07-26 11:29:20
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-26 11:30:44
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const addTsCompany = data => {
  return POST_WRAP('/ajax/company/tsCompany_h.jsp?cmd=addTsCompany', data);
};

export const setTsCompany = data => {
  return POST_WRAP('/ajax/company/tsCompany_h.jsp?cmd=setTsCompany', data);
};

export const getTsCompany = data => {
  return POST_WRAP('/ajax/company/tsCompany_h.jsp?cmd=getTsCompany', data);
};
