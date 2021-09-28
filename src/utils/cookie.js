/*
 * @Description  : cookie相关方法
 * @Author       : turbo
 * @Date         : 2021-02-03 11:44:46
 * @LastEditors  : turbo
 * @LastEditTime : 2021-03-31 14:46:01
 */

import { parse, serialize } from 'cookie';

/**
 * @description : 根据name获取cookie
 * @author      : turbo
 * @Date        : 2021-02-03 18:29:31
 * @param        {String} name
 * @return       {String}
 */
export function getCookie(name) {
  return parse(document.cookie)[name] || '';
}

/**
 * @description : 设置特定name的cookie
 * @author      : turbo
 * @Date        : 2021-02-03 18:30:13
 * @param        {String} name
 * @param        {String} value
 * @param        {Object} config
 * @return       {*} undefined
 */
export function setCookie(name, value, config) {
  document.cookie = serialize(name, value, config);
}

/**
 * @description : 根据cookie格式字符串设置cookie
 * @author      : turbo
 * @Date        : 2021-03-31 14:39:03
 * @param        {*} cookiesString
 * @return       {*}
 */
export function setCookieByString(cookiesString = '') {
  const cookies = parse(cookiesString);

  Object.keys(cookies).forEach(name => {
    setCookie(name, cookies[name]);
  });
}

// cookie 迁移过来的方法，可废弃
export const cookie = function(key, value, options) {
  // key and value given, set cookie...
  if (arguments.length > 1 && (value === null || typeof value !== 'object')) {
    options = Object.assign({}, options);
    if (value === null) {
      options.expires = -1;
    }
    if (typeof options.expires === 'number') {
      var days = options.expires,
        t = (options.expires = new Date());
      t.setDate(t.getDate() + days);
    }
    return (document.cookie = [
      encodeURIComponent(key),
      '=',
      options.raw ? String(value) : encodeURIComponent(String(value)),
      options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
      options.path ? '; path=' + options.path : '',
      options.domain ? '; domain=' + options.domain : '',
      options.secure ? '; secure' : '',
    ].join(''));
  }
  // key and possibly options given, get cookie...
  options = value || {};
  var result,
    decode = options.raw
      ? function(s) {
          return s;
        }
      : decodeURIComponent;
  result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie);
  return result ? decode(result[1]) : null;
};
