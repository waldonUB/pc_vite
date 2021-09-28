/*
 * @Author       : ADI
 * @Date         : 2021-04-21 11:22:08
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-21 11:27:30
 */
import { GET_WRAP, POST_WRAP } from '@/utils';

export const advanceUploadFile = ({ name, ts_hideLoading }, data) => {
  return POST_WRAP(`/ajax/upload_h.jsp?cmd=advanceUploadFile&fileName=${name}&ts_hideLoading=${ts_hideLoading}`, data);
};
