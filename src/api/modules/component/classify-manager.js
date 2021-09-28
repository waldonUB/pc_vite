/*
 * @Author       : ADI
 * @Date         : 2021-04-20 14:31:44
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-20 14:33:39
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const deleteClassifyDelTsGroup = data => {
  return POST_WRAP('/ajax/comm/tsGroup_h.jsp?cmd=delTsGroup', data);
};

export const classifyUpdateSort = data => {
  return POST_WRAP('/ajax/comm/tsGroup_h.jsp?cmd=updateSort', data);
};
