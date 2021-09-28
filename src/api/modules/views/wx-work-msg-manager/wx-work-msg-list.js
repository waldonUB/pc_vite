/*
 * @Author       : ADI
 * @Date         : 2021-07-22 17:25:15
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-22 17:56:46
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const checkSettingInfoComplete = params => {
  return GET_WRAP('/rest/manage/wxwork/chatData/checkSettingInfoComplete', params);
};

export const getChatDataContactStatList = params => {
  return GET_WRAP('/rest/manage/wxwork/chatData/getChatDataContactStatList', params);
};

export const getChatDataList = params => {
  return GET_WRAP('/rest/manage/wxwork/chatData/getChatDataList', params);
};
