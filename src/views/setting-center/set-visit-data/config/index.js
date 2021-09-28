/*
 * @Author       : ADI
 * @Date         : 2021-07-13 11:20:38
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 14:37:34
 */

import { postMessage } from '@/utils';

/**
 * 配置多实例提示弹窗
 * @param {Object} opt - 提示弹窗配置
 */
export const postMessageByMultiInstance = (
  opt = {},
  common = {
    duration: 1000,
    multiInstance: true,
  },
) => postMessage(Object.assign(common, opt));
