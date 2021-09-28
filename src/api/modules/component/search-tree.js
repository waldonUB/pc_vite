/*
 * @Author       : ADI
 * @Date         : 2021-04-21 10:36:17
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-21 10:37:33
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const searchDepartmentList = data => {
  return POST_WRAP('/ajax/department/tsDepartment_h.jsp?cmd=searchDepartmentList', data);
};

export const getTsStaffList = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=getTsStaffList', data);
};
