/*
 * @Author       : ADI
 * @Date         : 2021-04-20 16:20:49
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-21 15:16:46
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const getTsArticleRouterInfo = data => {
  return POST_WRAP('/ajax/article/tsArticle_h.jsp?cmd=getTsArticleRouterInfo', data);
};
