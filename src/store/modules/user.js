/*
 * @Description  : 帐号相关的 store
 * @Author       : turbo
 * @Date         : 2021-02-19 15:24:05
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-24 17:47:04
 */

import { logDog, postMessage, setCookie } from '@/utils';

import TsCommDef from '@/config/ts-comm-def';
import { getTsStaffExtraListByParam } from '@/api/modules/views/user';
import { logout } from '@/api/modules/views/user';
import versionDef from '@/config/version-def';

function _transTime(time, key) {
  const dayUnit = 24 * 60 * 60;
  const hourUnit = 60 * 60;
  const day = Math.floor(time / dayUnit);
  const remain = time % dayUnit;
  const hour = Math.floor(remain / hourUnit);
  if (key == 'day') {
    return day > 9 ? day : '0' + day;
  } else if (key == 'hour') {
    return hour > 9 ? hour : '0' + hour;
  }
}

export default {
  namespaced: true,
  state: {
    info: {
      isTest: undefined,
      isOpenCrmOrder: undefined,
      closeProduct: undefined,
      expireTimeName: undefined,
      isOem: undefined,
      isBClassUser: undefined,
      staffInfo: {},
      wxWorkUserInfo: {},
      acctInfo: {},
      versionInfo: {},
      openTime: undefined,
      isShowTreeTry: undefined,
      isOpenProduct: undefined,
      isPreTryAcct: undefined,
      msg: {},
      aid: undefined,
      sid: undefined,
      isMainAcct: undefined,
      isBType: undefined,
      headImg: undefined,
      reqlMpName: '',
      realMpQr: '',
    },
    tsStaffExtraList: [],
  },
  getters: {
    /**
     * 是否为管理员
     * @author lymn
     * @date 2021-03-20
     * modify by waldon 2021/01/13 新增wordId 4为自定义角色，权限目前和部门管理员一致
     * modify by lymn 2021/03/20 新增wordId 5为管理员角色，权限目前和创建者一致
     *                          1-创建人  2-销售员  3-部门管理员  4-自定义角色  5-管理员
     * modify by lymn 2021/05/10 去掉5-管理员 创建人和管理员合并为1-管理员
     *                          1-管理员  2-销售员  3-部门管理员  4-自定义角色
     */
    isManage(state) {
      return [1, 3, 4].includes(state.info?.staffInfo?.workId);
    },
    isDepartmentAdm(state) {
      // 是否是部门管理员
      // 2021年1月13日 waldon modify 新增wordId 4为自定义角色，权限目前和部门管理员一致
      return [3, 4].includes(state.info?.staffInfo?.workId);
    },
    /**
     * // 是否是管理员 (后端这里的判断是work等于1或者是创建者。问了后端大佬那边说创建者一定是超级管理员，因此这个字段是可以判断是否是超级管理员)
     * @date 2021-03-20
     * @modify by lymn 是否为管理员(包括创建者)，角色权限二期需求改造中，管理员创建者合并为管理员，拥有同等最高权限
     */
    isUpperAdm(state) {
      return state.info?.staffInfo?.isUpperAdm;
    },
    isCreator(state) {
      // 是否是创建者
      return state.info?.staffInfo?.creator;
    },
    isSuperUpperAdm(state) {
      return state.info?.staffInfo?.isSuperUpperAdm;
    },
    versionTip(state) {
      if (versionDef.getIsFreeTry()) {
        return '到期后付费功能将自动关闭';
      } else if (versionDef.getIsProfessionnal() && state.info?.versionInfo?.verRestDayTime < 30) {
        return '为确保正常使用，请及时续费';
      }
    },
    restDay(state) {
      return _transTime(state.info?.msg?.deadlineSecond, 'day');
    },
    restHour(state) {
      return _transTime(state.info?.msg?.deadlineSecond, 'hour');
    },
    isOemClass(state) {
      return !state.info.isOem ? 'directSale' : '';
    },
    isShowHelp(state, getters, { globalData }) {
      return !!globalData?.addressUrl?.portalHelpUrl;
    },
    /**
     * 判断角色的数据权限是否仅仅只能查看自己的数据，true：不是只能查看自己的数据
     * @author lymn
     * @date 2021-03-20
     */
    isNoOneSelfDataAuth(state, getters, { globalData }) {
      return state.info?.staffInfo?.dataAuthType != TsCommDef.dataAuthTypeDef.ONESELF;
    },
    nowShowMpName(state, getters, { globalData }) {
      if (state.info?.reqlMpName === '销售系统业务端') {
        return '销售系统业务端';
      }
      return '';
    },
    getFunctionLimit: (state, getters, rootState) => key => {
      return rootState.globalData.functionInfo[key];
    },
  },
  mutations: {
    setInfo(state, info) {
      state.info = info;
    },
    setTsStaffExtraList(state, tsStaffExtraList = []) {
      state.tsStaffExtraList = tsStaffExtraList;
    },
  },
  actions: {
    async logout() {
      const [err, res] = await logout();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg,
        });
      }
      logDog('logOut_click');
      setCookie('_TOKEN', '');
      window.location.href = '/';
    },
    /**
     * @description : 获取所有有职务的成员，即成员角色不为"无"
     * @author      : ADI
     * @Date        : 2021-06-17 11:27:15
     * @param        {*} commit
     * @return       {*}
     */
    async getTsStaffExtraListByParam({ commit }) {
      const [err, res] = await getTsStaffExtraListByParam();
      if (err) {
        return Promise.reject(err);
      }
      commit('setTsStaffExtraList', Object.freeze(res.data));
    },
  },
};
