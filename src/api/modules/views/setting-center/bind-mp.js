/*
 * @Author       : ADI
 * @Date         : 2021-07-06 15:33:57
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 15:39:09
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const refreshAll = data => {
  return POST_WRAP('/ajax/wxOpen/tsWxOpen_h.jsp?cmd=refreshAll', data);
};

export const getTsUserWxAuth = data => {
  return POST_WRAP('/ajax/userWxAuth/tsUserWxAuth_h.jsp?cmd=getTsUserWxAuth', data);
};

export const checkWxFunction = data => {
  return POST_WRAP('/ajax/wxOpen/tsWxOpen_h.jsp?cmd=checkWxFunction', data);
};

export const releaseApp = data => {
  return POST_WRAP('/ajax/userWxAuth/tsUserWxAuth_h.jsp?cmd=releaseApp', data);
};

export const submitCheck = params => {
  return GET_WRAP('/rest/manage/wxopen/submitCheck', params);
};

export const bindMpOneTimeSubMsgTempId = params => {
  return GET_WRAP('/rest/manage/wxopen/bindMpOneTimeSubMsgTempId', params);
};

export const unbindAuthInfo = data => {
  return POST_WRAP('/ajax/wxOpen/tsWxOpen_h.jsp?cmd=unbindAuthInfo', data);
};

export const syncUserWxTemp = data => {
  return POST_WRAP('/rest/manage/wxauth/syncUserWxTemp', data);
};

export const checkSyncStatusNow = data => {
  return POST_WRAP('/rest/manage/wxauth/checkSyncStatusNow', data);
};

export const refreshWxAuth = data => {
  return POST_WRAP('/ajax/wxOpen/tsWxOpen_h.jsp?cmd=refreshWxAuth', data);
};

export const bindingWxOpen = params => {
  return GET_WRAP('/rest/manage/wxopen/bindingWxOpen', params);
};

export const delAuthorizeErrMsg = data => {
  return POST_WRAP('/ajax/userWxAuth/tsUserWxAuth_h.jsp?cmd=delAuthorizeErrMsg', data);
};

export const getTxtList = data => {
  return POST_WRAP('/ajax/wxOpen/tsWxOpen_h.jsp?cmd=getTxtList', data);
};

export const getMpOneTimeSubMsgTempId = data => {
  return POST_WRAP('/ajax/wxOpen/tsWxOpen_h.jsp?cmd=getMpOneTimeSubMsgTempId', data);
};
