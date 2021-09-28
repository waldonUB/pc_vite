/*
 * @Author       : ADI
 * @Date         : 2021-06-28 11:35:44
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-28 11:36:35
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const delPoster = data => {
  return POST_WRAP('/rest/manage/card/poster/delPoster', data);
};

export const getPosterData = data => {
  return POST_WRAP('/rest/manage/card/poster/getPosterData', data);
};
