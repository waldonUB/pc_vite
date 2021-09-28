/*
 * @Author       : ADI
 * @Date         : 2021-05-17 17:29:21
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-17 17:29:48
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getAppQrcode = data => {
  return POST_WRAP('/ajax/userWxAuth/tsUserWxAuth_h.jsp?cmd=getAppQrcode', data);
};
