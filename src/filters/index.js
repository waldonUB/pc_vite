/*
 * @Author: ADI
 * @Date: 2021-03-23 15:30:55
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-23 15:31:29
 */
/**
 * 通过unicode计算字符串的精确长度
 * @author: ADI
 * @Date: 2021-03-23 15:31:27
 * @param {*} str
 * @param {*} ignores
 * @return {*}
 */
export function preciseStringLength(str, ignores) {
  if (typeof str !== 'string') {
    throw Error('Parameters must be a string');
  }
  if (ignores === 'space') {
    return str.trim().replace(/[^\x00-\xff]/g, 'rr').length;
  } else {
    return str.replace(/[^\x00-\xff]/g, 'rr').replace(/\s*/g, '').length;
  }
}
