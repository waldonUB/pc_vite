/*
 * @Author       : ADI
 * @Date         : 2021-07-12 10:00:28
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-12 10:06:55
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getDepartmentList = data => {
  return POST_WRAP('/ajax/department/tsDepartment_h.jsp?cmd=getDepartmentList', data);
};

export const getTsStaffListisTsCorp = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=getTsStaffList&isTsCorp=true', data);
};

export const setTsStaffWork = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=setTsStaffWork', data);
};

export const getStaffDefList = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=getStaffDefList', data);
};

export const setTsStaff = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=setTsStaff', data);
};

export const addTsStaff = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=addTsStaff', data);
};

export const unbind = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=unbind', data);
};

export const getStaffWorkCnt = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=getStaffWorkCnt', data);
};

export const getTsStaff = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=getTsStaff', data);
};

export const tsStaff_h = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp', data);
};

export const delDepartment = data => {
  return POST_WRAP('/ajax/department/tsDepartment_h.jsp?cmd=delDepartment', data);
};

export const batchAddDepStaffRel = data => {
  return POST_WRAP('/ajax/department/tsDepartment_h.jsp?cmd=batchAddDepStaffRel', data);
};

export const setDepartment = data => {
  return POST_WRAP('/ajax/department/tsDepartment_h.jsp?cmd=setDepartment', data);
};

export const addDepartment = data => {
  return POST_WRAP('/ajax/department/tsDepartment_h.jsp?cmd=addDepartment', data);
};
