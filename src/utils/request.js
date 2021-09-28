/*
 * @Description  : axios拦截与封装
 * @Author       : turbo
 * @Date         : 2021-02-03 15:17:34
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-29 11:43:24
 */

import { addUrlParams, getCookie, postMessage, stringify } from '@/utils';
import { cloneDeep, isArray, isObject, merge } from 'lodash';

import Schema from 'async-validator';
import axios from 'axios';
import store from '@/store';

const axiosInstance = axios.create({
  timeout: 1000 * 60,
});

const errMsgStructure = {
  data: {},
  msg: '系统繁忙，请稍后重试',
  rt: -1,
  success: false,
  total: 0,
};

/**
 * @description : 校验指定参数是否合法
 * @author      : turbo
 * @Date        : 2021-02-04 11:29:08
 * @param        {String} url
 * @param        {Object} params
 * @param        {Object} rules
 * @return       {Promise}
 */
function checkParams(url, params, rules) {
  if (!isObject(rules) || isArray(rules)) return;

  var validator = new Schema(rules);

  Object.keys(rules).forEach(key => {
    rules[key].type === 'number' && (params[key] = parseInt(params[key]));
  });

  return validator.validate(params, errors => {
    if (errors) {
      const errorMsg = errors.reduce((msg, cur) => {
        return msg + (msg ? ', ' : '') + `${cur.message}`;
      }, '');
      throw new Error(`请求 ${url} 参数错误, 传入参数: ${JSON.stringify(params)}, 错误信息: ${errorMsg}`);
    }
  });
}

/**
 * @description : 请求拦截器
 * @author      : turbo
 * @Date        : 2021-02-04 10:30:52
 */
axiosInstance.interceptors.request.use(config => {
  try {
    if (config.method === 'get') {
      const params = config.params || {};
      // ie会缓存get请求，所以请求后面带上时间戳
      params._t = Date.now();
      config.params = params;
    } else if (config.method === 'post') {
      config = merge(
        {},
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
        config,
      );
      isObject(config.data) &&
        config.headers['content-type'] === 'application/x-www-form-urlencoded' &&
        (config.data = stringify(config.data));
    }
    return merge(config, {
      url: addUrlParams(config.url, {
        _TOKEN: getCookie('_TOKEN'),
        _LOGIN_SIGN: getCookie('_LOGIN_SIGN'),
      }),
    });
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
});

/**
 * @description : 响应拦截器
 * @author      : turbo
 * @Date        : 2021-02-04 10:31:21
 */
axiosInstance.interceptors.response.use(
  async response => {
    const contentType = response?.headers?.['content-type'];
    const exceptionContentTypeList = ['image/jpeg'];
    const { data = {} } = response;
    const { rt } = data;

    // TOKEN 过期需要重新登录
    if (rt === -23) await store.dispatch('user/logout');

    if (exceptionContentTypeList.includes(contentType)) {
      return data;
    }

    // 设置默认值，避免一些 500 请求或 null 等拿不到数据时的情况
    return merge({}, errMsgStructure, data);
  },
  error => {
    return Promise.reject(errMsgStructure);
  },
);

/**
 * @description : get请求
 * @author      : turbo
 * @Date        : 2021-02-04 16:58:00
 * @param        {String} url
 * @param        {Object} config
 * @param        {Object} other
 * @return       {Promise}
 */
export async function get(url, config = {}, other = {}) {
  try {
    await checkParams(url, config.params, other.rules);
    config.params = cloneDeep(config);
    return axiosInstance.get(url, config);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function get2(url, config = {}, other = {}) {
  try {
    // await checkParams(url, config.params, other.rules);
    config.params = cloneDeep(config);
    return axiosInstance
      .get(url, config)
      .then(res => {
        const { success } = res;
        // 接口层返回错误处理
        if (success === false) {
          const err = res;
          return [err, null];
        }
        return [null, res.data, res];
      })
      .catch(err => {
        return [err, null];
      });
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * @description : post请求
 * @author      : turbo
 * @Date        : 2021-02-04 16:58:44
 * @param        {String} url
 * @param        {Object} data
 * @param        {Object} other
 * @param        {Object} config
 * @return       {Promise}
 */
export async function post(url, data, other = {}, config = {}) {
  try {
    await checkParams(url, data, other.rules);
    return axiosInstance.post(url, data, config);
  } catch (error) {
    return Promise.reject(error);
  }
}

function showMsg(methodFun, methodArgs, err) {
  if (methodFun === get) {
    const [url, data = {}] = methodArgs;
    if (!data.ts_hideMessage) {
      postMessage({
        type: 'error',
        message: err.msg || '网络错误，请稍候重试',
      });
    }
  }
}

// awaitTo wrap
function request(methodFun = get) {
  return async (...methodArgs) => {
    return await methodFun(...methodArgs)
      .then(res => {
        const { success } = res;
        // 接口层返回错误处理
        if (success === false) {
          const err = res;
          showMsg(methodFun, methodArgs, err);
          return [err, null];
        }
        return [null, res];
      })
      .catch(err => {
        showMsg(methodFun, methodArgs, err);
        return [err, null];
      });
  };
}
export const GET_WRAP = request(get);
export const POST_WRAP = request(post);
export default axiosInstance;
