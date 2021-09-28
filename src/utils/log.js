/*
 * @Author: ADI
 * @Date: 2021-03-22 16:35:16
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-06 15:34:58
 */

import { TsActType, logListConfig } from '@/config/log-list.js';
import { addException as addExceptionAjax, logFdp, reportAct } from '@/api/modules/utils/log';

import { post } from '@/utils';
import store from '@/store';

const getStoreState = () => store.state;
/**
 * 发送请求统计
 *
 * @author guoyijie
 * @date 2020-04-18
 * @modify 2020年5月18日 waldon 增加回调，防止没有打完log就跳转
 */
let timer = 0;
let recodeList = [];
export const sendRecord = function() {
  const str = JSON.stringify(recodeList);
  const isOem = getStoreState().user.info.isOem;
  let url = '/ajax/log_h.jsp?cmd=logAgentDogForMore'; // 默认旧逻辑 - 分销
  if (!isOem && typeof isOem != 'undefined') {
    url = '/ajax/log_h.jsp?cmd=logBssDogForMore';
  }
  return post(url, {
    logList: str,
  });
};

/**
 * 将log对象push进数组，3s发送一次
 *
 * @author guoyijie
 * @date 2020-04-18
 * @modify 2020年5月18日 waldon 增加回调，防止没有打完log就跳转
 */
export const recordClick = function(obj, noWait = false) {
  recodeList.push(obj);
  if (timer) {
    clearTimeout(timer);
  }
  return new Promise(resolve => {
    if (noWait) {
      // 避免页面跳转等待
      sendRecord().then(() => {
        recodeList = [];
        resolve();
      });
    } else {
      timer = setTimeout(() => {
        sendRecord().then(() => {
          recodeList = [];
          resolve();
        });
      }, 3000);
    }
  });
};

/**
 * 使用该方法前需要引入logList.src.js
 * @author enson
 * @date 2020-04-10
 * @modify 2020年5月18日 waldon 增加回调，防止没有打完log就跳转
 */
export const logDog = function(objName, noWait = false) {
  const isOem = getStoreState().user.info.isOem;
  if (isOem === undefined) {
    return console.warn('isOem未初始化');
  }
  const logList = isOem ? logListConfig.isOem : logListConfig.notOem;
  if (!logList) return console.warn('no logList');
  const obj = logList[objName];
  if (!obj) return console.warn(`no logList[${objName}]`);
  if (Object.keys(obj).length <= 0) return console.warn('logList.length <= 0');
  return new Promise(resolve => {
    recordClick(obj, noWait).then(() => {
      resolve();
    });
  });
};

/*
 * 对Fdp Log的封装
 * @author: enson
 * @date: 2020-07-09 15:57:27
 */
export const FdpLog = async (eventName, properties = {}) => {
  if (!eventName) return Promise.reject(`${eventName} 不存在`);
  const [err, res] = await logFdp({
    eventName,
    properties: JSON.stringify(properties),
    ts_hideLoading: true,
    ts_hideMessage: true,
  });
  if (err) {
    return Promise.reject(err);
  }
  return Promise.resolve();
};

/**
 * 封装关键行为记录方法
 * @author guoyijie
 * @date 2020/8/27
 * @param {type} 行为类型
 * @returns {number}} id（例如表单id，创建的时候没有id就不传）
 * */
export const ActLog = async (type, id) => {
  if (!type) return Promise.reject(`${type} 不存在!`);
  let obj = {
    type: TsActType[type],
    ts_hideLoading: true,
    ts_hideMessage: true,
  };
  if (id) {
    obj = Object.assign(obj, {
      dataId: id,
    });
  }
  const [err, res] = await reportAct(obj);
  if (err) {
    return Promise.reject(err);
  }
  return Promise.resolve();
};

/**
 * 前端异常统计
 * url为外面传的标识
 * @author waldon
 * @date 2021/4/2
 * @param {Object} option - 1.url 传一个便于查找的标识 2.result 传文字说明
 */
export const addException = async option => {
  const params = {
    ...{
      ts_hideLoading: true,
      ts_hideMessage: true,
      url: 'tsportal/', // 外面传标志
      result: '{"msg": "前端主动上传异常"}',
      args: '',
    },
    ...option,
  };
  const [err, res] = await addExceptionAjax(params);
  if (err) {
    return Promise.reject(err);
  }
};
