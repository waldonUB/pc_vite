/*
 * @Author       : ADI
 * @Date         : 2021-04-28 17:27:46
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-28 17:28:03
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
