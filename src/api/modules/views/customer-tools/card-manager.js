/*
 * @Author       : ADI
 * @Date         : 2021-06-04 11:38:21
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-21 17:48:09
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const saveTsCardModule = data => {
  return POST_WRAP('/rest/manage/card/saveTsCardModule', data);
};

export const getTsCardModule = data => {
  return POST_WRAP('/rest/manage/card/getTsCardModule', data);
};

export const setCardAsTemplate = data => {
  return POST_WRAP('/rest/manage/card/setCardAsTemplate', data);
};
