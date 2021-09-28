/*
 * @Author       : ADI
 * @Date         : 2021-05-31 10:03:45
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-21 15:38:07
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const changeShowCardTopBar = data => {
  return POST_WRAP('/rest/manage/card/changeShowCardTopBar', data);
};

export const getHdGameList = data => {
  return POST_WRAP('/ajax/hd/tsHd_h.jsp?cmd=getHdGameList', data);
};

export const getHdPcUrl = data => {
  return POST_WRAP('/ajax/hd/tsHd_h.jsp?cmd=getHdPcUrl', data);
};

export const getSimpleCardInfo = data => {
  return POST_WRAP('/rest/manage/card/getSimpleCardInfo', data);
};
