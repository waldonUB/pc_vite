/*
 * @Author       : ADI
 * @Date         : 2021-06-16 15:58:33
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 15:59:06
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const checkPriceNotify = data => {
  return POST_WRAP('/rest/manage/prof/checkPriceNotify', data);
};

export const confirmPriceNotify = data => {
  return POST_WRAP('/rest/manage/prof/confirmPriceNotify', data);
};
