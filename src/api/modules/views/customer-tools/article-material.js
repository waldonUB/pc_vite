/*
 * @Author       : ADI
 * @Date         : 2021-05-21 16:21:31
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-26 09:55:16
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const getTsArticleRouterInfo = data => {
  return POST_WRAP('/rest/manage/article/getTsArticleRouterInfo', data);
};

export const delArticleTemplate = data => {
  return POST_WRAP('/rest/manage/article/template/delArticleTemplate', data);
};

export const delArticle = data => {
  return POST_WRAP('/rest/manage/article/delArticle', data);
};

export const setArticleTemplate = data => {
  return POST_WRAP('/rest/manage/article/template/setArticleTemplate', data);
};

export const setAdTemplate = data => {
  return POST_WRAP('/rest/manage/article/template/setAdTemplate', data);
};

export const getCheckCache = data => {
  return POST_WRAP('/ajax/push/tsCheckCache_h.jsp?cmd=getCheckCache', data);
};

export const bindingWx = data => {
  return POST_WRAP('/ajax/wxOpen/tsWxOpen_h.jsp?cmd=bindingWx', data);
};

export const delArticleType = data => {
  return POST_WRAP('/rest/manage/article/type/delArticleType', data);
};

export const updateSort = data => {
  return POST_WRAP('/rest/manage/article/type/updateSort', data);
};

export const importWxArticle = data => {
  return POST_WRAP('/ajax/userWxAuth/tsWxMpAuth_h.jsp?cmd=importWxArticle', data);
};

export const getTempTypeList = data => {
  return POST_WRAP('/rest/manage/article/type/getTempTypeList', data);
};
