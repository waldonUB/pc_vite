/*
 * @Author       : ADI
 * @Date         : 2021-06-30 16:52:48
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 16:53:50
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getTempSelectList = data => {
  return POST_WRAP('/ajax/form/tsForm_h.jsp?cmd=getTempSelectList', data);
};

export const getTsFormDataList = data => {
  return POST_WRAP('/ajax/form/tsForm_h.jsp?cmd=getTsFormDataList', data);
};

export const getTsViewerRecordStat = data => {
  return POST_WRAP('/rest/manage/viewerRecord/getTsViewerRecordStat', data);
};
