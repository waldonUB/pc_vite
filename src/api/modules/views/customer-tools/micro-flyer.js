/*
 * @Author       : ADI
 * @Date         : 2021-05-31 10:43:00
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-31 11:31:27
 */
import { GET_WRAP, POST_WRAP } from '@/utils';
export { changeShowCardTopBar, getSimpleCardInfo } from './hd-game-activity';

export const getFlyerList = data => {
  return POST_WRAP('/ajax/hd/tsHd_h.jsp?cmd=getFlyerList', data);
};

export const getFlyerPcUrl = data => {
  return POST_WRAP('/ajax/hd/tsHd_h.jsp?cmd=getFlyerPcUrl', data);
};
