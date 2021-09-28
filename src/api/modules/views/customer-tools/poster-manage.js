/*
 * @Author       : ADI
 * @Date         : 2021-06-21 13:56:32
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 10:50:44
 */

import { GET_WRAP, POST_WRAP } from '@/utils';
import {
  deleteClassifyDelTsGroup as _delTsGroup,
  classifyUpdateSort as _updateSort,
} from '@/api/modules/component/classify-manager';

import { getKtPosterGroupList as _getKtPosterGroupList } from '@/api/modules/component/select-other-bubble';

export const getKtPosterGroupList = _getKtPosterGroupList;

export const createPosterFromTemp = data => {
  return POST_WRAP('/rest/manage/card/poster/createPosterFromTemp', data);
};

export const createKtPoster = data => {
  return POST_WRAP('/rest/manage/card/poster/createKtPoster', data);
};

export const delPoster = data => {
  return POST_WRAP('/rest/manage/card/poster/delPoster', data);
};

export const delTsGroup = _delTsGroup;

export const updateSort = _updateSort;
