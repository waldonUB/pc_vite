/*
 * @Author: ADI
 * @Date: 2021-03-23 09:53:32
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 11:46:20
 */
/**
 *管理正则表达式，根据type返回对应的正则
 *
 * @param {Number} type，正则类型
 * @returns {RegExp} RegExp,正则表达式
 */
export const manageRegxp = function(type) {
  switch (type) {
    //1-20个字符，字母或数字；首字为字母
    case 1:
      return /^[a-z|A-Z]\w{0,19}$/;
    //必须包含字母，数字，或特殊符号其中两种，并且要6~20个字符
    case 2:
      return /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{6,20}$/;
    //0到100的整数
    case 3:
      return /^(?:0|[1-9][0-9]?|100)$/;
    //整数，最多两位小数
    case 4:
      return /^\d+(\.\d{1,2})?$/;
    //是否输入的都是数字
    case 5:
      return /^[1-9]\d*$/;
    //除了数字的内容，全局搜索
    case 6:
      return /[^0-9]/g;
    //手机号码
    case 7:
      return /^1[3456789]\d{9}$/;
    // 验证身份证
    case 8:
      return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    // 最多只能2位小数
    case 9:
      return /([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])/;
    // 限制输入1~100
    case 10:
      return /^(?:[1-9][0-9]?|100)$/;
    case 11:
      return /^$|^1[3456789]\d{9}$/;
    case 12:
      return /^$|(.*mp.weixin.qq.com.*)|(.*zhuanlan.zhihu.com\/p\/.*)|(.*toutiao.com.*)|(.*m.toutiaocdn.cn.*)|(.*m.toutiaocdn.com.*)/;
    // 客户录入手机号校验
    case 13:
      return /^\d{6,25}$/;
  }
};
