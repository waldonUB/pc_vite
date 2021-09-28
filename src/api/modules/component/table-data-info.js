/*
 * @Author       : ADI
 * @Date         : 2021-04-20 17:17:32
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-20 17:22:40
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const getTsViewerArtcileList = data => {
  return POST_WRAP('/ajax/viewer/tsViewerArticle_h.jsp?cmd=getTsViewerArtcileList', data);
};

export const getTempCiStatAndCiRec = data => {
  return POST_WRAP('/ajax/form/tsForm_h.jsp?cmd=getTempCiStatAndCiRec', data);
};

export const getTempSelectList = data => {
  return POST_WRAP('/ajax/form/tsForm_h.jsp?cmd=getTempSelectList', data);
};

export const getTsFormCiRecDetail = data => {
  return POST_WRAP('/ajax/form/tsForm_h.jsp?cmd=getTsFormCiRecDetail', data);
};
