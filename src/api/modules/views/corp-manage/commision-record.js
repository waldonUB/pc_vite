/*
 * @Author       : ADI
 * @Date         : 2021-07-29 17:34:59
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 15:08:29
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const addBkgeRecord = data => {
  return POST_WRAP('/ajax/staff/tsStaffBkgeRecord_h.jsp?cmd=addBkgeRecord', data);
};

export const getTsStaffBkgeStat = data => {
  return POST_WRAP('/ajax/staff/tsStaffBkgeRecord_h.jsp?cmd=getTsStaffBkgeStat', data);
};

export const payBkgeRecord = data => {
  return POST_WRAP('/ajax/staff/tsStaffBkgeRecord_h.jsp?cmd=payBkgeRecord', data);
};

export const getBkgeDefList = data => {
  return POST_WRAP('/ajax/staff/tsStaffBkgeRecord_h.jsp?cmd=getBkgeDefList', data);
};
