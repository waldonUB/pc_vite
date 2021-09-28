/*
 * @Description  : 全局导航守卫
 * @Author       : turbo
 * @Date         : 2021-02-08 17:02:49
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-27 11:08:27
 */

import { addUrlParams, getCookie } from '@/utils';
import { getGlobalData, getTsStaffExtraListByParam, getTsUserWxAuthAppQr } from '@/api/modules/views/user';

import router from '@/router';
import store from '@/store';

// 登录校验白名单
const whiteList = [];
const isDevelopment = process.env.NODE_ENV !== 'production';
if (isDevelopment) {
  whiteList.push('/login');
  router.addRoute({
    name: 'Login',
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/login/index.vue'),
  });
  store.commit('user/setInfo', { isOem: process.env.VUE_APP_IS_OEM === 'true' });
}

/**
 * @description : 拦截 beforeEach 钩子并给所有 beforeEach 钩子添加登录白名单校验
 * @author      : turbo
 * @Date        : 2021-02-22 17:05:28
 * @param        {NavigationGuard<Vue>} guard
 * @return       {Function}
 */
const beforeEach = router.beforeEach;
router.beforeEach = function(guard) {
  return beforeEach.call(router, function(to, from, next) {
    if (whiteList.includes(to.path)) return next();

    return guard.call(this, to, from, next);
  });
};

// 校验是否已登录
router.beforeEach((to, from, next) => {
  // 已登录
  console.log('getCookie()', getCookie('_TOKEN'));
  if (getCookie('_TOKEN')) return next();

  // 开发模式下跳转到业务方自己的登录页面
  if (isDevelopment) return next(`/login?redirect=${to.path}`);

  // 非开发模式下跳转到公司的公共登录页面
  window.location.replace(
    addUrlParams(store.state.globalData.portalUrl, {
      url: window.location.href,
    }),
  );
});

// 初始化全局数据
router.beforeEach((to, from, next) => {
  if (store.state.init) return next();

  Promise.all([getGlobalData(), getTsUserWxAuthAppQr(), getTsStaffExtraListByParam()])
    .then(
      async ([
        [globalDateErr, globalDateRes],
        [wxAuthAppDataErr, wxAuthAppDataRes],
        [setTsStaffExtraListErr, setTsStaffExtraListRes],
      ]) => {
        if (globalDateErr || wxAuthAppDataErr || setTsStaffExtraListErr) {
          next();
        }
        store.commit('setGlobalData', { ...globalDateRes.data.globalData });
        store.commit('user/setInfo', {
          ...globalDateRes.data.userInfo,
          ...{
            reqlMpName: wxAuthAppDataRes.data.appName,
            realMpQr: wxAuthAppDataRes.data.qrUrl,
          },
        });
        store.commit('user/setTsStaffExtraList', Object.freeze(setTsStaffExtraListRes.data));

        const routes = await store.dispatch('router/getRoutes', globalDateRes.data.globalData.routerList);
        routes.map(route => router.addRoute(route));
        document.title = globalDateRes.data.userInfo.isOem ? '销售管理系统' : '凡科客户通';
        store.commit('setInit', true);

        let path = to.fullPath;
        if (to.name === 'redirect') {
          path = to.params.path;

          if (!path) {
            const route = store.getters['router/getFirstRoute'];
            path = route.url;
          }
        }
        next({
          name: 'redirect',
          params: { path },
          replace: true,
        });
      },
    )
    .catch(err => {
      next();
    });
});

// 处理 redirect 没有带 params 参数时的情况
router.beforeEach((to, from, next) => {
  if (to.name !== 'redirect') return next();
  if (to.params.path) return next();

  const route = store.getters['router/getFirstRoute'];
  next({
    path: route.url,
  });
});
