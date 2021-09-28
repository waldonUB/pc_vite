/*
 * @Author       : ADI
 * @Date         : 2021-04-20 16:26:53
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 11:25:59
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getViewerMallRelList = data => {
  return POST_WRAP('/rest/manage/viewerRecord/getViewerMallRelList', data);
};
