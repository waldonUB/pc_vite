/*
 * @Author       : ADI
 * @Date         : 2021-04-20 17:09:19
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 10:13:14
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const wxworkGetRegisterUrl = data => {
  return GET_WRAP('/rest/manage/wxwork/getRegisterUrl', data);
};

export const wxworkGetAppAuthUrl = data => {
  return GET_WRAP('/rest/manage/wxwork/getAppAuthUrl', data);
};
