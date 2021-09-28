/*
 * @Description  : 企微相关的 api
 * @Author       : turbo
 * @Date         : 2021-07-20 17:48:00
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-22 09:55:30
 */

import { POST_WRAP, GET_WRAP } from '@/utils';

export function getGroupChatList(data) {
  return POST_WRAP('/rest/manage/wxwork/groupChat/getGroupChatList', data);
}

export function getGroupChatInfo(data) {
  return POST_WRAP('/rest/manage/wxwork/groupChat/getGroupChatInfo', data);
}

export function getChatMemberList(data) {
  return POST_WRAP('/rest/manage/wxwork/chatMember/getChatMemberList', data);
}

export function getCorpTagList(data) {
  return POST_WRAP('/ajax/wxWork/tag/tsTag_h.jsp?cmd=getCorpTagList', data);
}

export function syncCorpTagList(data) {
  return POST_WRAP('/ajax/wxWork/tag/tsTag_h.jsp?cmd=syncCorpTagList', data);
}

export function addCorpTag(data) {
  return POST_WRAP('/ajax/wxWork/tag/tsTag_h.jsp?cmd=addCorpTag', data);
}

export function editCorpTag(data) {
  return POST_WRAP('/ajax/wxWork/tag/tsTag_h.jsp?cmd=editCorpTag', data);
}

export function delCorpTag(data) {
  return POST_WRAP('/ajax/wxWork/tag/tsTag_h.jsp?cmd=delCorpTag', data);
}

export function checkHadData(data) {
  return POST_WRAP('/rest/manage/wxwork/msgTask/checkHadData', data);
}

export function addMsgTask(data) {
  return POST_WRAP('/rest/manage/wxwork/msgTask/addMsgTask', data);
}

export function getSelectClientCnt(data) {
  return POST_WRAP('/rest/manage/wxwork/msgTask/getSelectClientCnt', data);
}

export function sendMsgInform(data) {
  return POST_WRAP('/rest/manage/wxwork/msgTask/sendMsgInform', data);
}

export function cancelMsgTask(data) {
  return POST_WRAP('/rest/manage/wxwork/msgTask/cancelMsgTask', data);
}

export function delMsgTask(data) {
  return POST_WRAP('/rest/manage/wxwork/msgTask/delMsgTask', data);
}

export function getMsgTaskInfo(data) {
  return POST_WRAP('/rest/manage/wxwork/msgTask/getMsgTaskInfo', data);
}

export function getSendMsgDetailList(data) {
  return POST_WRAP('/rest/manage/wxwork/msg/getSendMsgDetailList', data);
}

export function getReceiveMsgDetailList(data) {
  return POST_WRAP('/rest/manage/wxwork/msg/getReceiveMsgDetailList', data);
}
