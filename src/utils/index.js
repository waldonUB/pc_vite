/*
 * @Description  : 工具类方法
 * @Author       : turbo
 * @Date         : 2021-02-03 11:44:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 14:17:30
 */

import { Message } from 'element-ui';

// 模块引入
export * from './business';
export * from './browser';
export * from './cookie';
export * from './draw';
export * from './file-upload';
export * from './log';
export * from './operate-data';
export * from './regxp';
export * from './request';
export * from './storage';
export * from './time';
// export * from './ueditor-config';
export * from './url';
export * from './jsx-components';
export * from './_mix-error-object';
export * from './export-excel';
export * from './user';
export * from './client';
export * from './secret';

// 按命名作用域导出
export * as types from './types';
export * as dom from './dom';

//封装了$message方法,用法一致，只是某些参数要改一改
export const postMessage = (function() {
  var holdQuene = []; //存储当前的错误信息
  var postMessageCount = 0;
  var isOnPushQuene = []; //正在显示的消息队列
  var clearShowQuene = function() {
    isOnPushQuene.forEach(data => {
      data && data.close();
    });
    isOnPushQuene = [];
  }; //除掉所有的消息队列
  return function(opt) {
    if (!opt.message) return;
    var isInList = false;
    holdQuene.forEach(data => {
      //当前有相同类型以及相同信息的提示，不出
      if (data.type == opt.type && data.message == opt.message && !opt.multiInstance) {
        isInList = true;
        return;
      }
      //如果当前有登录已过期的提示的话
      if (data.type == 'error' && data.message == '请刷新后重新登录') {
        isInList = true;
        return;
      }
    });
    if (isInList) return;
    const nowCount = postMessageCount;
    holdQuene.push({
      type: opt.type,
      message: opt.message,
      cid: postMessageCount++,
    });
    setTimeout(() => {
      let targetIndex;
      holdQuene.forEach((data, index) => {
        if (data.cid == nowCount) {
          targetIndex = index;
          return;
        }
      });
      if (typeof targetIndex != 'undefined') {
        holdQuene.splice(targetIndex, 1);
      }
    }, 5000);
    var iconClass = '';
    if (opt.type) {
      if (opt.type === 'success') {
        iconClass = ' success';
        clearShowQuene();
      } else if (opt.type == 'warning') {
        iconClass = ' warning';
      } else if (opt.type == 'error') {
        iconClass = ' error';
        clearShowQuene();
      }
    } else {
      iconClass = opt.customClass;
    }
    const duration = opt.duration == undefined ? 5000 : opt.duration;
    //全局变量，唯一示例
    isOnPushQuene.push(
      Message(
        Object.assign(opt, {
          customClass: 'tShuIconAll' + iconClass,
          showClose: false,
          duration: duration,
        }),
      ),
    );
    return {
      clearFun: clearShowQuene,
    };
  };
})();

/**
 *点击复制
 *
 * @author guoyijie
 * @date 2020-07-20
 * @param {String} copyValue复制内容,{String} successTip成功提示,{String} errorTip失败提示
 * @returns
 */
export const clipboard = function(copyValue, successTip, errorTip, isTextArea) {
  const input = document.createElement(isTextArea ? 'textarea' : 'input');
  document.body.appendChild(input);
  if (isTextArea) {
    // 如果是多行文本
    input.value = copyValue;
  } else {
    input.setAttribute('value', copyValue);
  }
  input.select();
  const flag = document.execCommand('copy');
  if (flag) {
    postMessage({
      type: 'success',
      message: successTip,
    });
  } else {
    postMessage({
      type: 'error',
      message: errorTip,
    });
  }
  document.body.removeChild(input);
};
