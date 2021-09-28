/*
 * @Author       : ADI
 * @Date         : 2021-07-15 15:31:14
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-29 11:54:56
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const generatorForShareQr = data => {
  return POST_WRAP(
    '/rest/manage/qrCode/generatorForShareQr',
    data,
    {},
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      responseType: 'blob',
    },
  );
};
