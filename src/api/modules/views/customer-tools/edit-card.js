/*
 * @Author       : ADI
 * @Date         : 2021-06-03 11:33:28
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-21 16:16:38
 */

import { GET_WRAP, POST_WRAP } from '@/utils';
import { getTsGuideListAjax, saveTsGuideAjax } from '@/api/modules/common';

export const getNowCardStatData = data => {
  return POST_WRAP('/rest/manage/card/getNowCardStatData', data);
};

export const getPreviewQr = data => {
  return POST_WRAP('/rest/manage/card/getPreviewQr', data);
};

export const getTsGuideList = getTsGuideListAjax;

export const saveTsGuide = saveTsGuideAjax;

export const getCardTempPreviewData = data => {
  return POST_WRAP('/rest/manage/card/getCardTempPreviewData', data);
};

export const getMyCardPreviewData = data => {
  return POST_WRAP('/rest/manage/card/getMyCardPreviewData', data);
};
