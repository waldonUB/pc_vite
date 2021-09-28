/*
 * @Author: ADI
 * @Date: 2021-03-25 09:24:56
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 17:34:51
 */

import store from '@/store';

const versionDef = {};
const getUserInfoByStore = () => store.state.user?.info;
const getGlobalDataByStore = () => store.state.globalData;

// 直销版本定义
class DirectVersionDef {
  constructor() {}
  // 这里是按照版本权限顺序排下来的，递增关系，越往后版本权限越大。
  static VersionList = {
    FREE: 0, //免费版
    FREETRY: 102, //7天试用版
    BASE: 103, //基础版
    PROFESSIONNAL: 101, //专业版
  };

  static getVersionInfo() {
    const versionInfo = getUserInfoByStore().versionInfo;
    let updateTips = versionInfo.realVersion == DirectVersionDef.VersionList.FREE ? '立即升级' : '续费升级';
    if (versionInfo.realVersion == DirectVersionDef.VersionList.PROFESSIONNAL) {
      updateTips = '续费';
    }
    return {
      isShowVersionBox: !getUserInfoByStore().isShowTreeTry,
      topClass: `top_direct_${versionInfo.realVersion}`,
      littleClass: versionDef.checkIsFree() ? 'dirVersionMedalFree' : '',
      versionName: versionInfo.versionName,
      expireTimeName: versionInfo.expireTimeName,
      updateTips: updateTips,
    };
  }

  static getVersionName(version) {
    switch (version) {
      case DirectVersionDef.VersionList.FREE:
        return '免费版';
      case DirectVersionDef.VersionList.FREETRY:
        return '试用版';
      case DirectVersionDef.VersionList.PROFESSIONNAL:
        return '专业版';
      case DirectVersionDef.VersionList.BASE:
        return '基础版';
    }
  }

  /**
   * 获取比当前版本更高的版本
   * @author lymn
   * @date 2020-09-14
   * @return {Number|undefined} 返回版本的值，若没有更高版本时返回undefined
   */
  static getUpperVersion() {
    const versionInfo = getUserInfoByStore().versionInfo;
    // 直销 目前三个版本：免费版、专业版
    const currentVer = versionInfo.realVersion;
    const verArr = [];
    const { FREE, BASE, PROFESSIONNAL } = versionDef.DirectVersionDef.VersionList;
    verArr.push(FREE, BASE, PROFESSIONNAL);

    const nextIndex = verArr.indexOf(currentVer) + 1; // 下一个更高级的版本
    if (nextIndex < verArr.length) {
      // 如果存在更高的版本
      return verArr[nextIndex];
    }
    return;
  }

  /**
   *检查客户，是否有指定的版本权限。
   *
   * @author tomato
   * @date 2020-07-22
   * @static
   * @param {Number} needVer，需要的版本
   * @memberof DirectVersionDef
   */
  static checkVersion(needVer) {
    const versionInfo = getUserInfoByStore().versionInfo;
    const versionKey = Object.keys(DirectVersionDef.VersionList);
    const index = versionKey.findIndex(ele => {
      return DirectVersionDef.VersionList[ele] == needVer;
    });

    const realIndex = versionKey.findIndex(ele => {
      return DirectVersionDef.VersionList[ele] == versionInfo.version;
    });

    return realIndex >= index;
  }
}

// 分销版本定义
class NotDirectVersionDef {
  constructor() {}
  // 这里是按照版本权限顺序排下来的，递增关系，越往后版本权限越大。
  static VersionList = {
    FREE: 0, //免费版
    FREETRY: 5, //7天试用
    PERSON: 3, //个人版
    STANDARD: 6, //标准版
    MID: 1, //高级版
    AGENT: 2, //代理商专用版
    HONOR: 4, //尊享版（即将下架）
  };

  static getVersionInfo() {
    const versionInfo = getUserInfoByStore().versionInfo;
    let updateTips = versionInfo.realVersion == NotDirectVersionDef.VersionList.FREE ? '立即升级' : '续费升级';
    if (versionInfo.realVersion == NotDirectVersionDef.VersionList.MID) {
      updateTips = '续费';
    }
    return {
      isShowVersionBox: !getUserInfoByStore().isShowTreeTry,
      topClass: `top_notdirect_${versionInfo.realVersion}`,
      littleClass: versionDef.checkIsFree() ? 'dirVersionMedalFree' : '',
      versionName: versionInfo.versionName,
      expireTimeName: versionInfo.expireTimeName,
      updateTips: updateTips,
    };
  }
  static getVersionName(version) {
    switch (version) {
      case NotDirectVersionDef.VersionList.FREE:
        return '免费版';
      case NotDirectVersionDef.VersionList.PERSON:
        return '个人版';
      case NotDirectVersionDef.VersionList.FREETRY:
        return '试用版';
      case NotDirectVersionDef.VersionList.STANDARD:
        return '标准版';
      case NotDirectVersionDef.VersionList.MID:
        return '高级版';
      case NotDirectVersionDef.VersionList.HONOR:
        return '尊享版';
      case NotDirectVersionDef.VersionList.AGENT:
        return '代理商专用版';
    }
  }
  /**
   *检查客户，是否有指定的版本权限。
   *
   * @author tomato
   * @date 2020-07-22
   * @static
   * @param {Number} needVer，需要的版本
   * @memberof NotDirectVersionDef
   */
  static checkVersion(needVer) {
    const versionInfo = getUserInfoByStore().versionInfo;
    const versionKey = Object.keys(NotDirectVersionDef.VersionList);
    const index = versionKey.findIndex(ele => {
      return NotDirectVersionDef.VersionList[ele] == needVer;
    });

    const realIndex = versionKey.findIndex(ele => {
      return NotDirectVersionDef.VersionList[ele] == versionInfo.version;
    });

    return realIndex >= index;
  }

  /**
   * 获取比当前版本更高的版本
   * @author lymn
   * @date 2020-09-14
   * @return {Number|undefined} 返回版本的值，若没有更高版本时返回undefined
   */
  static getUpperVersion() {
    const versionInfo = getUserInfoByStore().versionInfo;
    // 分销 目前三个版本：试用版、标准版、高级版
    const currentVer = versionInfo.realVersion;
    const verArr = [];
    const { FREE, STANDARD, MID } = versionDef.NotDirectVersionDef.VersionList;
    verArr.push(FREE, STANDARD, MID); // 版本列表

    const nextIndex = verArr.indexOf(currentVer) + 1; // 下一个更高级的版本
    if (nextIndex < verArr.length) {
      // 如果存在更高的版本
      return verArr[nextIndex];
    }
    return;
  }
}

/**
 *获取版本Id的，获取对应的版本信息
 *
 * @param {Number} versionId
 * @returns {Object} 返回defInfo中对应的版本限制信息。
 */
versionDef.getVersionInfo = () => {
  if (getUserInfoByStore().isOem) {
    return { ...versionDef.NotDirectVersionDef.getVersionInfo() };
  } else {
    return { ...versionDef.DirectVersionDef.getVersionInfo() };
  }
};

/**
 *获取功能限制点
 *
 * @param {String} key
 */
versionDef.getFunctionLimit = key => {
  const functionLimit = getGlobalDataByStore().functionInfo; //用户的功能限制列表
  return functionLimit[key];
};
/**
 *获取是否是7天试用版
 *
 * @param {String} key
 */
versionDef.getIsFreeTry = key => {
  return getUserInfoByStore().msg.isTry && getUserInfoByStore().msg.realVer === 0;
};

/**
 *获取是否是基础版/标准版
 *
 * @param {String} key
 */
versionDef.getIsProfessionnal = () => {
  if (getUserInfoByStore().isOem) {
    return versionDef.checkVersion(versionDef.NotDirectVersionDef.VersionList.STANDARD);
  } else {
    return versionDef.checkVersion(versionDef.DirectVersionDef.VersionList.BASE);
  }
};

/**
 *检查是否是免费版
 *
 * @returns
 */
versionDef.checkIsFree = () => {
  const versionInfo = getUserInfoByStore().versionInfo;
  if (getUserInfoByStore().isOem) {
    return versionInfo.version == NotDirectVersionDef.VersionList.FREE;
  }
  return versionInfo.version == DirectVersionDef.VersionList.FREE;
};

/**
 *用于返回限制的版本
 *
 * @returns
 */
versionDef.getLimitVer = (oemLimitVer, limitVer) => {
  if (getUserInfoByStore().isOem) {
    return versionDef.NotDirectVersionDef.VersionList[oemLimitVer];
  }
  return versionDef.DirectVersionDef.VersionList[limitVer];
};

/**
 *检查客户是否有版本权限。
 *
 * @param {*} needVer
 * @returns
 */
versionDef.checkVersion = needVer => {
  return getUserInfoByStore().isOem
    ? NotDirectVersionDef.checkVersion(needVer)
    : DirectVersionDef.checkVersion(needVer);
};
/**
 *根据版本获取对应的版本名称
 *
 * @param {*} version
 * @returns
 */
versionDef.getVersionName = version => {
  return getUserInfoByStore().isOem
    ? NotDirectVersionDef.getVersionName(version)
    : DirectVersionDef.getVersionName(version);
};

versionDef.getUpperVersion = () => {
  return getUserInfoByStore().isOem ? NotDirectVersionDef.getUpperVersion() : DirectVersionDef.getUpperVersion();
};
versionDef.DirectVersionDef = DirectVersionDef;
versionDef.NotDirectVersionDef = NotDirectVersionDef;

export default versionDef;
