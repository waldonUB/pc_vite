/*
 * @Author       : ADI
 * @Date         : 2021-08-04 12:02:14
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-04 15:20:52
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const submitCheck = params => {
  return GET_WRAP('/rest/manage/wxopen/submitCheck', params);
};
