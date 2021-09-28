/*
 * @Author       : ADI
 * @Date         : 2021-07-07 16:13:05
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 16:16:46
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const setTsStaffByMessageReminder = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=setTsStaffByMessageReminder', data);
};

export const checkWxWorkApplicationScope = data => {
  return POST_WRAP('/rest/manage/wxwork/checkWxWorkApplicationScope', data);
};

export const getTsStaffByMessageReminder = data => {
  return POST_WRAP('/rest/manage/staff/getTsStaffByMessageReminder', data);
};

export const getStaffBindMpQrCode = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=getStaffBindMpQrCode', data);
};
