import { isPlainObject } from 'lodash';
/**
 * 只返回filList里面的字段。其余字段全部过滤
 * @author: ADI
 * @Date: 2021-03-23 09:45:56
 * @param {Object} initData
 * @param {Array[String]} filList
 * @return {*}
 */
export const filterData = function(initData, filList) {
  return filList.reduce((pre, key) => {
    return initData[key] !== undefined ? Object.assign(pre, { [key]: initData[key] }) : pre;
  }, {});
};

/**
 *将阿拉伯数字转为中文
 *
 * @author guoyijie
 * @date 2020-04-18
 * @param {*} oldTime
 * @returns
 */
export const transNum = function(num) {
  var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
  var arr2 = new Array(
    '',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
  ); //可继续追加更高位转换值
  if (!num || isNaN(num)) {
    return '零';
  }
  var english = num.toString().split('');
  var result = '';
  for (var i = 0; i < english.length; i++) {
    var des_i = english.length - 1 - i; //倒序排列设值
    result = arr2[i] + result;
    var arr1_index = english[des_i];
    result = arr1[arr1_index] + result;
  }
  //将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
  //合并中间多个零为一个零
  result = result.replace(/零+/g, '零');
  //将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
  //将【亿万】换成【亿】
  result = result.replace(/亿万/g, '亿');
  //移除末尾的零
  result = result.replace(/零+$/, '');
  //将【零一十】换成【零十】
  //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
  //将【一十】换成【十】
  result = result.replace(/^一十/g, '十');
  return result;
};

/**
 *
 * 文字超出...
 * @author guoyijie
 * @modify waldon 2020年8月25日
 * @date 2020-04-09
 * @param {string} text - 字符串内容
 * @param {number} width - 一行显示最大宽度
 * @param {number} fontSize - 字体大小
 * @param {number} lineNum - 行数
 * @returns {String} str(超出隐藏...的字符串)
 */
export const textEllipsis = function(text, width, fontSize, lineNum = 1) {
  const oneCharWidth = fontSize / 2;
  const maxCharNum = Math.floor(width / oneCharWidth) * lineNum;
  let temp = 0;
  let str = '';
  let index = 0;
  for (let a = 0; a < text.length; a++) {
    if (temp < maxCharNum) {
      //中文字符和大写字母
      if (text.charCodeAt(a) > 255 || (text.charCodeAt(a) >= 65 && text.charCodeAt(a) < 90)) {
        //字符编码大于255，说明是双字节字符
        temp += 2; //则累加2个
      } else {
        temp++; //否则递加一次
      }
      index = a;
    }
  }
  if (index < text.length - 1) {
    str = text.substring(0, index) + '...';
  } else {
    str = text;
  }
  return str;
};

export const deepClone = function(target) {
  // 定义一个变量
  let result;
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (const i in target) {
        // 递归克隆数组中的每一项
        result.push(deepClone(target[i]));
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null;
      // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.constructor === RegExp) {
      result = target;
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {};
      for (const i in target) {
        result[i] = deepClone(target[i]);
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target;
  }
  // 返回最终结果
  return result;
};

/**
 * @description : 将对象拼接成key=value形式的字符串
 * @author      : turbo
 * @Date        : 2021-02-04 09:30:28
 * @param        {Object} obj
 * @return       {String}
 */
export function stringify(obj) {
  return Object.keys(obj)
    .map(key => {
      let value = obj[key];
      if (value === undefined) return '';
      if (value === null) return encodeURIComponent(key);
      if (Array.isArray(value) || isPlainObject(value)) value = JSON.stringify(value);
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(s => s.length > 0)
    .join('&');
}
