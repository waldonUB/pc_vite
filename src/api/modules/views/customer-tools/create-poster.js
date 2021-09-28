/*
 * @Author       : ADI
 * @Date         : 2021-06-25 14:42:32
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-25 14:54:06
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const getTsGroupList = data => {
  return POST_WRAP('/ajax/comm/tsGroup_h.jsp?cmd=getTsGroupList', data);
};

export const createPoster = data => {
  return POST_WRAP('/rest/manage/card/poster/createPoster', data);
};

export const getTmpPosterIdAndCardInfo = data => {
  return POST_WRAP('/rest/manage/card/poster/getTmpPosterIdAndCardInfo', data);
};

export const uploadTmpFile = formData => {
  return POST_WRAP(
    '/ajax/upload_h.jsp?cmd=uploadTmpFile&ts_hideLoading=true',
    formData,
    {},
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  );
};
