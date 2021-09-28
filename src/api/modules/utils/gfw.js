/*
 * @Author       : ADI
 * @Date         : 2021-05-07 14:59:44
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-24 09:35:51
 */
// /rest/manage/gfw/getGfwInto

import { GET_WRAP, POST_WRAP } from '@/utils';

// http://st.ppp.top.junes.faidev.cc/rest/manage/gfw/getGfwInto
export const getGfwInto = data => {
  return GET_WRAP('/rest/manage/gfw/getGfwInto', data);
  // return GET_WRAP('/junes/rest/manage/gfw/getGfwInto', data);
};
