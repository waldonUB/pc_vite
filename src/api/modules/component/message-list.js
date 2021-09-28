/*
 * @Author       : ADI
 * @Date         : 2021-06-17 10:53:40
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 10:54:06
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getChatDataContactRelList = params => {
  return GET_WRAP('/rest/manage/wxwork/chatData/getChatDataContactRelList', params);
};
