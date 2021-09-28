/*
 * @Author       : ADI
 * @Date         : 2021-04-20 14:09:26
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-03 20:22:58
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const batchAddMaterialInfo = data => {
  return POST_WRAP(
    '/rest/manage/material/batchAddTsMaterialInfo',
    data,
    {},
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    },
  );
};

export const getFileMatList = data => {
  return POST_WRAP(
    '/rest/manage/material/getFileMatList',
    data,
    {},
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    },
  );
};
