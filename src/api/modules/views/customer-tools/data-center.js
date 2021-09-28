/*
 * @Author       : ADI
 * @Date         : 2021-05-25 15:31:33
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-28 10:33:33
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const articleDataGetDef = data => {
  return POST_WRAP('/rest/manage/article/data/getDef', data);
};

export const articleDataGetList = data => {
  return POST_WRAP('/rest/manage/article/data/getList', data);
};

export const setArticleStatus = data => {
  return POST_WRAP('/rest/manage/article/setArticleStatus', data);
};

export const getListForPc = data => {
  return POST_WRAP('/rest/manage/article/getListForPc', data);
};

export const getTsViewerRecordStat = data => {
  return POST_WRAP('/rest/manage/viewerRecord/getTsViewerRecordStat', data);
};

export const getDef = data => {
  return POST_WRAP('/ajax/corpSearch/tsCorpSearch_h.jsp?cmd=getDef', data);
};

export const getCorpList = data => {
  return POST_WRAP('/ajax/corpSearch/tsCorpSearch_h.jsp?cmd=getCorpList', data);
};

export const getCorpDetail = data => {
  return POST_WRAP('/ajax/corpSearch/tsCorpSearch_h.jsp?cmd=getCorpDetail', data);
};
