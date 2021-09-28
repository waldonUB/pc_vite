/*
 * @Author       : ADI
 * @Date         : 2021-07-07 14:17:06
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 14:18:21
 */

import MD5 from 'md5.js';

export const md5 = text => {
  return new MD5().update(text).digest('hex');
};
