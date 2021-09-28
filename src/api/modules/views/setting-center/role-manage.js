/*
 * @Author       : ADI
 * @Date         : 2021-07-07 16:40:49
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-08 10:43:20
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const setRoleInfo = data => {
  return POST_WRAP('/ajax/staff/tsStaffRole_h.jsp?cmd=setRoleInfo', data);
};

export const getRoleList = data => {
  return POST_WRAP('/rest/manage/permissions/role/getList', data);
};

export const delRole = data => {
  return POST_WRAP('/rest/manage/permissions/role/del', data);
};

export const saveRole = data => {
  return POST_WRAP('/rest/manage/permissions/role/save', data);
};

export const getRole = params => {
  return GET_WRAP('/rest/manage/permissions/role/get', params);
};

export const getDataPermissionsTypeDef = params => {
  return GET_WRAP('/rest/manage/permissions/getDataPermissionsTypeDef', params);
};
