/*
 * @Author       : ADI
 * @Date         : 2021-04-21 10:50:52
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 11:59:20
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

import { getTsGroupList as _getTsGroupList } from '@/api/modules/views/customer-tools/create-poster';

export const getTsGroupList = _getTsGroupList;

export const getKtPosterGroupList = data => {
  return POST_WRAP('/rest/manage/card/poster/getKtPosterGroupList', data);
};
