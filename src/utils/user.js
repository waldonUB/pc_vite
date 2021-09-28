/*
 * @Description  : user 相关工具方法
 * @Author       : turbo
 * @Date         : 2021-05-28 10:52:16
 * @LastEditors  : turbo
 * @LastEditTime : 2021-05-28 11:12:07
 */

import { user } from '@/api';

const { getTsProfConf } = user;

export const getConfInfo = async () => {
  const [err, res] = await getTsProfConf();
  if (err) {
    postMessage({
      type: 'error',
      message: err.msg || '网络错误，请稍候重试',
    });
    return Promise.reject(err);
  }
  return Promise.resolve(res.data.profConf);
};
