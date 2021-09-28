/*
 * @Author: ADI
 * @Date: 2021-03-23 10:07:55
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-23 11:14:57
 */
export const Browser = (() => {
  const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  const isOpera = userAgent.indexOf('Opera') > -1; //判断是否Opera浏览器
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera; //判断是否IE浏览器
  const isEdge = userAgent.indexOf('Edge') > -1; //判断是否IE的Edge浏览器
  const isFF = userAgent.indexOf('Firefox') > -1; //判断是否Firefox浏览器
  const isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1; //判断是否Safari浏览器
  const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1; //判断Chrome浏览器
  return {
    isIE,
    isEdge,
    isSafari,
    isChrome,
    isFF,
    isOpera,
  };
})();
