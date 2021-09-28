/*
 * @Author       : ADI
 * @Date         : 2021-06-10 14:43:13
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-15 14:30:34
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const batchDelFileOrDir = data => {
  return POST_WRAP('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=batchDelFileOrDir', data);
};

export const getProductMaterialList = data => {
  return POST_WRAP('/rest/manage/library/getProductMaterialList', data);
};

export const setTsGroup = data => {
  return POST_WRAP('/ajax/comm/tsGroup_h.jsp?cmd=setTsGroup', data);
};

export const cloneGroupFromProductMaterial = data => {
  return POST_WRAP('/rest/manage/material/cloneGroupFromProductMaterial', data);
};

export const getProductMaterial = data => {
  return POST_WRAP('/rest/manage/library/getProductMaterial', data);
};

export const cloneFromProductMaterial = data => {
  return POST_WRAP('/rest/manage/material/cloneFromProductMaterial', data);
};

export const batchMoveFileOrDir = data => {
  return POST_WRAP('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=batchMoveFileOrDir', data);
};

export const getMaterialDirTree = data => {
  return POST_WRAP('/rest/manage/group/getMaterialDirTree', data);
};

export const batchAddMaterialInfo = data => {
  return POST_WRAP('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=batchAddMaterialInfo', data);
};

export const addTsGroup = data => {
  return POST_WRAP('/ajax/comm/tsGroup_h.jsp?cmd=addTsGroup', data);
};

export const getMaterialResInfo = data => {
  return POST_WRAP('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=getMaterialResInfo', data);
};

export const getFileOrDirAttr = data => {
  return POST_WRAP('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=getFileOrDirAttr', data);
};

export const cloneMaterial = data => {
  return POST_WRAP('/rest/manage/material/cloneMaterial', data);
};
