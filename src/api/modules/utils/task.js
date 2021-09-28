/*
 * @Description  : 同步任务相关的 api
 * @Author       : turbo
 * @Date         : 2021-06-18 09:26:40
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-23 17:59:31
 */

import { POST_WRAP, GET_WRAP } from '@/utils';

export function addUploadTask(data) {
  return POST_WRAP('/rest/manage/uploadTask/addUploadTask', data);
}

export function exportInvalidList(data) {
  return POST_WRAP('/ajax/uploadTask/tsUploadTask_h.jsp?cmd=exportInvalidList', data);
}

export function getDefList(data) {
  return POST_WRAP('/ajax/uploadTask/tsUploadTask_h.jsp?cmd=getDefList', data);
}

export function getTaskResult(data) {
  return POST_WRAP('/ajax/uploadTask/tsUploadTask_h.jsp?cmd=getTaskResult', data);
}
