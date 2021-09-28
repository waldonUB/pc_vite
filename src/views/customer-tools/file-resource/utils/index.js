/*
 * @Author       : ADI
 * @Date         : 2021-06-09 14:53:19
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-09 15:43:32
 */

import {
  clipboard,
  confirm,
  downloadImg,
  encodeHtml,
  exportExcel,
  getFileName,
  getUrL,
  getWorkerList,
  gotoWxCorpSet,
  loading,
  post,
} from '@/utils';

import { CategoryDef } from '../config';

/**
 * 获取文件类型
 * @author lymn
 * @date 2021-01-26
 * @param {Boolean} param
 * @return {Boolean} return
 */
export function getFileCategory(name) {
  const docAcceptCal = '.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.pps,.ppsx';
  const imgAcceptCal = '.jpg,.jpeg,.png';
  const videoAcceptCal = '.mp4';
  const suffix = getFileName(name)[1].toLowerCase();
  if (docAcceptCal.indexOf(suffix) != -1) {
    return CategoryDef.doc;
  } else if (imgAcceptCal.indexOf(suffix) != -1) {
    return CategoryDef.img;
  } else {
    return CategoryDef.video;
  }
}
