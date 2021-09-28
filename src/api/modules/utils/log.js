/*
 * @Author       : ADI
 * @Date         : 2021-04-21 16:00:33
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 13:51:17
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const logAgentDogForMore = data => {
  return POST_WRAP('/ajax/log_h.jsp?cmd=logAgentDogForMore', data);
};

export const logBssDogForMore = data => {
  return POST_WRAP('/ajax/log_h.jsp?cmd=logBssDogForMore', data);
};

export const logFdp = data => {
  return POST_WRAP('/ajax/log_h.jsp?cmd=logFdp', data);
};

export const reportAct = data => {
  return POST_WRAP('/rest/manage/report/reportAct', data);
};

export const addException = data => {
  return POST_WRAP('/ajax/tsExceptionStat_h.jsp?cmd=addException', data);
};
