/*
 * @Description  : 第三方相关的 api
 * @Author       : turbo
 * @Date         : 2021-07-22 11:07:29
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-22 13:22:16
 */

import { POST_WRAP, GET_WRAP } from '@/utils';

export function getTsCompanyList(data) {
  return POST_WRAP('/ajax/company/tsCompany_h.jsp?cmd=getTsCompanyList', data);
}

export function addAgentThirdInfo(data) {
  return POST_WRAP('/ajax/third/tsAgentThird_h.jsp?cmd=addAgentThirdInfo', data);
}

export function getTsCompanyDefList(data) {
  return POST_WRAP('/ajax/company/tsCompany_h.jsp?cmd=getTsCompanyDefList', data);
}

export function setProUrl(data) {
  return POST_WRAP('/ajax/third/tsProUrl_h.jsp?cmd=setProUrl', data);
}
