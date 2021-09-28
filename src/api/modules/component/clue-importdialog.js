/*
 * @Author       : ADI
 * @Date         : 2021-07-15 14:50:06
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 14:50:41
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const addUploadTask = data => {
  return POST_WRAP('/rest/manage/uploadTask/addUploadTask', data);
};
