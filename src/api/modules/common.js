/*
 * @Author       : ADI
 * @Date         : 2021-04-21 11:04:17
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 11:52:47
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

// 同步企微用户
export const syncWxWorkUserAjax = data => {
  return POST_WRAP('/ajax/staff/tsStaff_h.jsp?cmd=syncWxWorkUser', data);
};

// 查企微用户标签
export const getCorpTagListAjax = data => {
  return POST_WRAP('/ajax/wxWork/tag/tsTag_h.jsp?cmd=getCorpTagList', data);
};

// 企微用户详情
export const getWxWorkConfInfoAjax = data => {
  return POST_WRAP('/ajax/conf/tsConf_h.jsp?cmd=getWxWorkConfInfo', data);
};

// 获取部门
export const getDepStaffRelListAjax = data => {
  return POST_WRAP('/ajax/department/tsDepartment_h.jsp?cmd=getDepStaffRelList', data);
};

// 获取指引
export const getTsGuideListAjax = data => {
  return POST_WRAP('/ajax/guide/tsGuide_h.jsp?cmd=getTsGuideList', data);
};

// 保存单次指引
export const saveTsGuideAjax = data => {
  return POST_WRAP('/ajax/guide/tsGuide_h.jsp?cmd=saveTsGuide', data);
};

// 企微tag
export const getWxWorkCorpAjax = data => {
  return POST_WRAP('/rest/manage/wxwork/getWxWorkCorp', data);
};

// 获取功能限制
export const getTsFunctionsAjax = data => {
  return POST_WRAP('/rest/manage/prof/verFunc/getTsFunctions', data);
};

// checkPush
export const checkPush = data => {
  return POST_WRAP('/ajax/push/tsPushConf_h.jsp?cmd=checkPush', data);
};

export const getDownloadTemplateUrl = data => {
  return POST_WRAP('/ajax/uploadTask/tsUploadTask_h.jsp?cmd=getDownloadTemplateUrl', data);
};
