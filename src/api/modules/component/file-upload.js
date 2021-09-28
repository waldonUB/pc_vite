/*
 * @Author       : ADI
 * @Date         : 2021-04-21 15:21:11
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-21 15:22:58
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

// 获取上传文件的AccessKey
export const getAccessKeyAjax = data => {
  return POST_WRAP('/ajax/upload_h.jsp?cmd=getAccessKey', data);
};

// 查询校验文件
export const getTxtListAjax = data => {
  return POST_WRAP('/ajax/wxOpen/tsWxOpen_h.jsp?cmd=getTxtList&type=1', data);
};

export const batchAddAjax = data => {
  return POST_WRAP('/rest/manage/material/sysRes/batchAdd', data);
};
