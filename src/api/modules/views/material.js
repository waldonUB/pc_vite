/*
 * @Description  : 话术相关的 api
 * @Author       : turbo
 * @Date         : 2021-07-28 10:56:37
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-28 15:53:59
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export function addTsMaterialInfo(data) {
  return POST_WRAP(
    '/rest/manage/material/addTsMaterialInfo',
    data,
    {},
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    },
  );
}

export function setTsMaterialInfo(data) {
  return POST_WRAP(
    '/rest/manage/material/setTsMaterialInfo',
    data,
    {},
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    },
  );
}

export function batchDelTsMaterial(data) {
  return POST_WRAP('/rest/manage/material/batchDelTsMaterial', data);
}
