/*
 * @Description  : 客户 & 线索相关的 api
 * @Author       : turbo
 * @Date         : 2021-06-07 15:15:44
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-19 14:39:40
 */

import { POST_WRAP, GET_WRAP } from '@/utils';

// 线索管理 start
export function getTsUserDefinedList(data) {
  return POST_WRAP('/rest/manage/userDefined/getTsUserDefinedList', data);
}

export function getTsClientDef(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=getTsClientDef', data);
}

export function getAddressList(data) {
  return POST_WRAP('/rest/manage/client/getAddressList', data);
}

export function getDef(data) {
  return POST_WRAP('/rest/manage/clueStat/getDef', data);
}

export function addTsClueStatInfo(data) {
  return POST_WRAP('/rest/manage/clueStat/addTsClueStatInfo', data);
}

export function setTsClientStatInfo(data) {
  return POST_WRAP('/rest/manage/clueStat/setTsClientStatInfo', data);
}

export function getList(data) {
  return POST_WRAP('/rest/manage/clueStat/getList', data);
}

export function getListByTypeWithInsert(data) {
  return POST_WRAP('/rest/manage/group/getListByTypeWithInsert', data);
}

export function batchSetTsUserDefinedList(data) {
  return POST_WRAP('/rest/manage/userDefined/batchSetTsUserDefinedList', data);
}

export function batchSetCustomer(data) {
  return POST_WRAP('/rest/manage/clueStat/batchSetCustomer', data);
}

export function getClue(data) {
  return POST_WRAP('/rest/manage/clueStat/clueSea/get', data);
}

export function batchRelease(data) {
  return POST_WRAP('/rest/manage/clueStat/batchRelease', data);
}

export function distributeClue(data) {
  return POST_WRAP('/rest/manage/clueStat/clueSea/distribute', data);
}

export function getTsClueStatRecordList(data) {
  return POST_WRAP('/rest/manage/viewerRecord/getTsClueStatRecordList', data);
}

export function getTsViewerBehaviorAnalysis(params) {
  return GET_WRAP('/rest/manage/viewerRecord/getTsViewerBehaviorAnalysis', params);
}
// 线索管理 end

// 客户管理 start
export function getClientCnt(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=getClientCnt', data);
}

export function getCrmDefinedList(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=getCrmDefinedList', data);
}

export function getCorpTagList(data) {
  return POST_WRAP('/ajax/wxWork/tag/tsTag_h.jsp?cmd=getCorpTagList', data);
}

export function getTsUserFollowStatusList(data) {
  return POST_WRAP('/ajax/userField/tsUserField_h.jsp?cmd=getTsUserFollowStatusList', data);
}

export function syncClient(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=syncClient', data);
}

export function getTsClient(data) {
  return POST_WRAP('/rest/manage/client/getTsClient', data);
}

export function checkClientMobile(data) {
  return POST_WRAP('/rest/manage/client/checkClientMobile', data);
}

export function addTsClient(data) {
  return POST_WRAP('/rest/manage/client/addTsClient', data);
}

export function setTsClient(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=setTsClient', data);
}

export function delTsClient(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=delTsClient', data);
}

export function getTsClientList(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=getTsClientList', data);
}

export function getTsRepeatClientList(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=getTsRepeatClientList', data);
}

export function mergerRepeatTsClient(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=mergerRepeatTsClient', data);
}

export function getTsClientRepeatList(data) {
  return GET_WRAP('/rest/manage/client/getTsClientRepeatList', data);
}

export function mergerRepeatTsClientByClientId(data) {
  return GET_WRAP('/rest/manage/client/mergerRepeatTsClientByClientId', data);
}

export function getTsSmsTotal(data) {
  return POST_WRAP('/ajax/sms/tsSms_h.jsp?cmd=getTsSmsTotal', data);
}

export function getTsSmsTemplateList(data) {
  return POST_WRAP('/ajax/sms/tsSms_h.jsp?cmd=getTsSmsTemplateList', data);
}

export function sendSms(data) {
  return POST_WRAP('/ajax/sms/tsSms_h.jsp?cmd=sendSms', data);
}

export function getTsClientCompanyList(data) {
  return POST_WRAP('/ajax/client/tsClientCompany_h.jsp?cmd=getTsClientCompanyList', data);
}

export function getRecordList(data) {
  return POST_WRAP('/ajax/viewer/tsViewerRecord_h.jsp?cmd=getRecordList', data);
}

export function getTsClientVisitsList(data) {
  return POST_WRAP('/rest/manage/client/visit/getTsClientVisitsList', data);
}

export function setTsClientFollowStatus(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=setTsClientFollowStatus', data);
}

export function unbindAssistClient(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=unbindAssistClient', data);
}

export function setTsClientIntention(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=setTsClientIntention', data);
}

export function getCanRelateViewerList(data) {
  return POST_WRAP('/rest/manage/clueStat/getCanRelateViewerList', data);
}

export function getTsClientClueRelList(data) {
  return POST_WRAP('/rest/manage/client/clueRel/getTsClientClueRelList', data);
}

export function addTsClientClueRelInfo(data) {
  return POST_WRAP('/rest/manage/client/clueRel/addTsClientClueRelInfo', data);
}

export function cancelTsClientClueRelInfo(data) {
  return POST_WRAP('/rest/manage/client/clueRel/cancelTsClientClueRelInfo', data);
}

export function setTsClientTagRelList(data) {
  return POST_WRAP('/ajax/client/tsClient_h.jsp?cmd=setTsClientTagRelList', data);
}

export function addTsVisitRecord(data) {
  return POST_WRAP('/rest/manage/client/visit/addTsVisitRecord', data);
}

export function setTsClientStatus(data) {
  return POST_WRAP('/rest/manage/client/setTsClientStatus', data);
}
// 客户管理 end
