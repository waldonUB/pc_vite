/*
 * @Author       : ADI
 * @Date         : 2021-04-20 17:55:48
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 10:13:43
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const batchChangeGroup = data => {
  return POST_WRAP('/rest/manage/material/batchChangeGroup', data);
};
