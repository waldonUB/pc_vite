/*
 * @Description  : 数据中心相关的 api
 * @Author       : turbo
 * @Date         : 2021-07-26 11:16:58
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-26 11:17:00
 */

import { POST_WRAP, GET_WRAP } from '@/utils';

export function getLcCntData(data) {
  return POST_WRAP('/rest/manage/dataCenter/getLcCntData', data);
}

export function getIntvTypeCntData(data) {
  return POST_WRAP('/rest/manage/dataCenter/getIntvTypeCntData', data);
}

export function getClientSourceCntData(data) {
  return POST_WRAP('/rest/manage/dataCenter/getClientSourceCntData', data);
}

export function getToolUseCntData(data) {
  return POST_WRAP('/rest/manage/dataCenter/getToolUseCntData', data);
}

export function getTaskCompleteCntData(data) {
  return POST_WRAP('/rest/manage/dataCenter/getTaskCompleteCntData', data);
}

export function getClientFollowCntData(data) {
  return POST_WRAP('/rest/manage/dataCenter/getClientFollowCntData', data);
}
