/*
 * @Description  : 帐号相关的 api
 * @Author       : turbo
 * @Date         : 2021-02-04 14:32:02
 * @LastEditors  : turbo
 * @LastEditTime : 2021-05-28 11:23:09
 */

import { POST_WRAP, GET_WRAP } from '@/utils';

export function login(data) {
  return POST_WRAP('/ajax/login_h.jsp?cmd=login', data);
}

export function getGlobalData(params) {
  return GET_WRAP('/ajax/tsportal_h.jsp?cmd=getGlobalData', params);
}

export function logout() {
  return POST_WRAP('/ajax/login_h.jsp?cmd=logout');
}

export function getTsUserWxAuthAppQr() {
  return POST_WRAP('/ajax/userWxAuth/tsUserWxAuth_h.jsp?cmd=getTsUserWxAuthAppQr');
}

// 获取所有有职务的成员，即成员角色不为"无"
export function getTsStaffExtraListByParam() {
  return POST_WRAP('/rest/manage/staff/getTsStaffExtraListByParam');
}

export function getTsProfConf() {
  return POST_WRAP('/rest/manage/prof/getTsProfConf');
}

export function setTsProfConf(data) {
  return POST_WRAP('/rest/manage/prof/setTsProfConf', data);
}

export function getTsFunctions() {
  return POST_WRAP('/rest/manage/prof/verFunc/getTsFunctions');
}
