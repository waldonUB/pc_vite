/*
 * @Author       : ADI
 * @Date         : 2021-07-05 14:55:16
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 17:49:43
 */

import { GET_WRAP, POST_WRAP } from '@/utils';

export const checkWxWorkConf = data => {
  return POST_WRAP('/rest/manage/wxwork/checkWxWorkConf', data);
};

// 保存企微授权信息-内部应用
export const saveWxWorkCorpByAgent = data => {
  return POST_WRAP('/rest/manage/wxwork/saveWxWorkCorpByAgent', data);
};

// 企微设置 - 保存企微授权信息-客户联系设置
export const saveWxWorkCorpByExternal = data => {
  return POST_WRAP('/rest/manage/wxwork/saveWxWorkCorpByExternal', data);
};

// 保存企微授权信息-通讯录设置
export const saveWxWorkCorpByUser = data => {
  return POST_WRAP('/rest/manage/wxwork/saveWxWorkCorpByUser', data);
};

// 保存企微名称跟企微id
export const saveWxWorkCorpByCorp = data => {
  return POST_WRAP('/rest/manage/wxwork/saveWxWorkCorpByCorp', data);
};

// 企微小程序的安装链接
export const getAppAuthUrlByApplet = data => {
  return GET_WRAP('/rest/manage/wxwork/getAppAuthUrlByApplet', data);
};

// 企微小程序的保存
export const saveWxWorkCorpByApple = data => {
  return POST_WRAP('/rest/manage/wxwork/saveWxWorkCorpByApple', data);
};

// 获取企微会话记录：企微接入信息
export const getSettingInfo = data => {
  return GET_WRAP('/rest/manage/wxwork/chatData/getSettingInfo', data);
};

// 保存企微会话记录：企微接入信息
export const saveSettingInfo = data => {
  return POST_WRAP('/rest/manage/wxwork/chatData/saveSettingInfo', data);
};

// 检查企微会话记录接入是否已完成
export const checkSettingInfoComplete = data => {
  return GET_WRAP('/rest/manage/wxwork/chatData/checkSettingInfoComplete', data);
};

export const checkWxAuthIsOk = params => {
  return GET_WRAP('/rest/manage/wxauth/checkWxAuthIsOk', params);
};

export const getUserWxAuth = params => {
  return GET_WRAP('/rest/manage/wxauth/getUserWxAuth', params);
};

// 获取随机token/aeskey
export const getRandomStrAndNum = data => {
  return POST_WRAP('/rest/manage/wxwork/getRandomStrAndNum', data);
};
