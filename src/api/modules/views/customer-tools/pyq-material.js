/*
 * @Author       : ADI
 * @Date         : 2021-06-02 17:50:48
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-02 17:52:45
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const batchDelMaterial = data => {
  return POST_WRAP('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=batchDelMaterial', data);
};

export const getMaterialInfo = data => {
  return POST_WRAP('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=getMaterialInfo', data);
};

export const addMaterialInfo = data => {
  return POST_WRAP('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=addMaterialInfo', data);
};

export const setTsWxWorkMaterial = data => {
  return POST_WRAP('/ajax/wxWork/material/tsMaterial_h.jsp?cmd=setTsWxWorkMaterial', data);
};
