/*
 * @Author       : ADI
 * @Date         : 2021-06-08 14:03:47
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-21 15:19:53
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getWebsite = data => {
  return POST_WRAP('/rest/manage/card/getWebsite', data);
};

export const changeWebsiteOpenStatus = data => {
  return POST_WRAP('/rest/manage/card/changeWebsiteOpenStatus', data);
};

export const setWebsite = data => {
  return POST_WRAP('/rest/manage/card/setWebsite', data);
};
