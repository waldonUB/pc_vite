/*
 * @Author       : ADI
 * @Date         : 2021-04-21 10:42:18
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-21 10:44:15
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const getDepartmentListIsGetAll = data => {
  return POST_WRAP('/ajax/department/tsDepartment_h.jsp?cmd=getDepartmentList', data);
};
