/*
 * @Description  : 仓库表
 * @Author       : turbo
 * @Date         : 2021-01-12 17:10:35
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-28 16:17:10
 */

import Vue from 'vue';
import Vuex from 'vuex';

// 自动导入 modules 下的子模块
const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
const devRuntime = process.env.NODE_ENV !== 'production';

/**
 * @description : 替换资源域名为proxy
 * @author      : ADI
 * @Date        : 2021-07-28 16:07:13
 * @param        {*} url 需要代理的url
 * @param        {*} host 需要代理的host
 * @param        {*} prefix 代理路径
 * @return       {*}
 */
function proxyUrl(url, host, prefix = '/proxy') {
  return url.replace(host, prefix);
}
/**
 * @description : 代理globalData.addressUrl里的jsp资源路径
 * @author      : ADI
 * @Date        : 2021-07-28 16:07:49
 * @param        {*} keys 需要修改的key数组
 * @param        {*} globalData 数据源
 * @return       {*}
 */
function proxyAddressUrls(keys, globalData) {
  const host = `//${globalData.addressUrl.nowHost}`;
  for (const key of keys) {
    const url = globalData.addressUrl[key];
    if (url) {
      globalData.addressUrl[key] = proxyUrl(url, host);
    }
  }
}

Vue.use(Vuex);

const storeInstance = new Vuex.Store({
  state: {
    init: false,
    globalData: {},
  },
  getters: {
    tsportalUrl(state) {
      return state.globalData?.tsportalUrl;
    },
    tsportalUrlProxy(state) {
      // devServer中，代理页面中需要引用到jsp资源
      if (devRuntime) {
        return '/proxy';
      }
      return state.globalData?.tsportalUrl;
    },
    resRoot(state) {
      const base = '/' + process.env.VUE_APP_BASE_URL;
      if (devRuntime) {
        return location.href + base;
      }
      return state.globalData.resRoot + base;
    },
  },
  mutations: {
    setInit(state, init) {
      state.init = init;
    },
    setGlobalData(state, globalData) {
      if (devRuntime) {
        proxyAddressUrls(['formiFramePreView', 'productiFramePreView'], globalData);
      }
      state.globalData = globalData;
    },
  },
  actions: {},
  modules,
});

export default storeInstance;
