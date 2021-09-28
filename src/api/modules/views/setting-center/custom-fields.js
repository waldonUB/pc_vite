/*
 * @Author       : ADI
 * @Date         : 2021-07-13 10:08:00
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 10:12:36
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getListByTypeWithInsert = data => {
  return POST_WRAP('/rest/manage/group/getListByTypeWithInsert', data);
};

export const addTsGroup = data => {
  return POST_WRAP('/rest/manage/group/addTsGroup', data);
};

export const setTsGroup = data => {
  return POST_WRAP('/rest/manage/group/setTsGroup', data);
};

export const delTsGroup = data => {
  return POST_WRAP('/rest/manage/group/delTsGroup', data);
};

export const updateSort = data => {
  return POST_WRAP('/ajax/comm/tsGroup_h.jsp?cmd=updateSort', data);
};

export const getTsUserFollowStatusList = data => {
  return POST_WRAP('/ajax/userField/tsUserField_h.jsp?cmd=getTsUserFollowStatusList', data);
};

export const delTsUserFollowStatus = data => {
  return POST_WRAP('/ajax/userField/tsUserField_h.jsp?cmd=delTsUserFollowStatus', data);
};

export const getTsUserFieldInfo = data => {
  return POST_WRAP('/ajax/userField/tsUserField_h.jsp?cmd=getTsUserFieldInfo', data);
};

export const getTsUserFieldDef = data => {
  return POST_WRAP('/ajax/userField/tsUserField_h.jsp?cmd=getTsUserFieldDef', data);
};

export const saveTsUserFieldWithOption = data => {
  return POST_WRAP('/ajax/userField/tsUserField_h.jsp?cmd=saveTsUserFieldWithOption', data);
};

export const setAbleForTsUserField = data => {
  return POST_WRAP('/ajax/userField/tsUserField_h.jsp?cmd=setAbleForTsUserField', data);
};

export const delTsUserField = data => {
  return POST_WRAP('/ajax/userField/tsUserField_h.jsp?cmd=delTsUserField', data);
};

export const saveTsUserFollowStatus = data => {
  return POST_WRAP('/ajax/userField/tsUserField_h.jsp?cmd=saveTsUserFollowStatus', data);
};
