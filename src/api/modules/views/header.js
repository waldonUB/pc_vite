/*
 * @Author       : ADI
 * @Date         : 2021-05-13 17:32:42
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 10:56:32
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const changeSimpleCardInfo = data => {
  return POST_WRAP('/rest/manage/card/changeSimpleCardInfo', data);
};
