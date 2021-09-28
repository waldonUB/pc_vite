/*
 * @Author       : ADI
 * @Date         : 2021-04-20 15:22:59
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-20 15:38:11
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const getDepartmentList = data => {
  return POST_WRAP('/ajax/department/tsDepartment_h.jsp?cmd=getDepartmentList', data);
};
