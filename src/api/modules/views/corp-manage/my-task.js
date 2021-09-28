/*
 * @Author       : ADI
 * @Date         : 2021-07-25 10:24:44
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:03:43
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getTaskTypeDef = data => {
  return POST_WRAP('/rest/manage/marketingTask/getTaskTypeDef', data);
};

export const getTsMarketingDetail = data => {
  return POST_WRAP('/rest/manage/marketingDetails/getTsMarketingDetail', data);
};
