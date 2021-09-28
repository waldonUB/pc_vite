/*
 * @Author       : ADI
 * @Date         : 2021-07-07 15:10:34
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 15:11:00
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const setPwd = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=setPwd', data);
};
