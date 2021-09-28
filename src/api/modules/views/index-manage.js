/*
 * @Description  : 首页相关的 api
 * @Author       : turbo
 * @Date         : 2021-05-28 11:46:01
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-17 15:57:11
 */

import { POST_WRAP, GET_WRAP } from '@/utils';

export function getPortalIndexConfList(data) {
  return POST_WRAP('/ajax/stat/tsStat_h.jsp?cmd=getPortalIndexConfList', data);
}

export function getIndexDataStatList(data) {
  return POST_WRAP('/ajax/stat/tsStat_h.jsp?cmd=getIndexDataStatList', data);
}

export function getAdvertisementList(data) {
  return POST_WRAP('/ajax/push/tsPushConf_h.jsp?cmd=getAdvertisementList', data);
}

export function getIndexArticle(data) {
  return POST_WRAP('/ajax/push/tsPushConf_h.jsp?cmd=getIndexArticle', data);
}
