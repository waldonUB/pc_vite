/*
 * @Description  : 路由相关的 store
 * @Author       : turbo
 * @Date         : 2021-02-23 10:35:18
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-06 15:23:11
 */

import Layout from '@/layout/index.vue';
import { kebabCase } from 'lodash';

const modules = import.meta.glob('../../views/**/*.vue');

/**
 * @description : 深度优先遍历展开路由列表（用于侧边栏导航查找和获取第一个路由路径）
 * @author      : turbo
 * @Date        : 2021-03-04 15:03:39
 * @param        {Object} route - 需要展开的路由节点
 * @param        {String} parentName - 父节点路由的 url
 * @return       {Array}
 */
function deepFirstSearch(route, parentName) {
  const children = route.children;
  route.parentName = parentName || '';
  return children ? children.reduce((arr, item) => arr.concat(deepFirstSearch(item, route.url)), [route]) : [route];
}

/**
 * @description : 获取路由跳转映射表
 * @author      : turbo
 * @Date        : 2021-03-04 15:04:55
 * @param        {String} fileName - views 目录下的文件夹名
 * @param        {Object} route
 * @return       {Array}
 */
function getChildrenRoutes(fileName, route) {
  if (route?.children?.length > 0) {
    return route.children.reduce((arr, item) => arr.concat(getChildrenRoutes(fileName, item)), []);
  } else {
    const children = route?.childrenRouterList || [];
    return children.reduce((arr, item) => arr.concat(getChildrenRoutes(fileName, item)), [
      {
        name: route.url,
        path: '/' + route.url,
        meta: {
          permissionsKey: route.permissionsKey, // 当前页面的菜单权限key值
          funcList: route.funcList, // 有权限的功能列表
        },
        component: () => {
          const fixfile = `${kebabCase(route.url)}/index`;
          const separator = fileName ? '/' : '';
          const uri = kebabCase(fileName) + separator + fixfile + '.vue';
          if (process.env.VITE) {
            return modules[`../../views/${uri}`]();
          }
          return import(
            /* webpackPrefetch: true */ /* webpackChunkName: "[request]" */ /* @vite-ignore */ '@/views/' + uri
          );
        },
      },
    ]);
  }
}

export default {
  namespaced: true,
  state: {
    unfoldRouterList: [], // 深度优先遍历展开后的路由数组
    needReload: false,
  },
  getters: {
    getFirstRoute(state) {
      return state.unfoldRouterList.find(item => item?.children?.length == 0);
    },
  },
  mutations: {
    setUnfoldRouterList(state, unfoldRouterList) {
      state.unfoldRouterList = unfoldRouterList;
    },
    setNeedReload(state, payload) {
      state.needReload = payload;
    },
  },
  actions: {
    getRoutes({ commit }, routerList) {
      const routes = [],
        unfoldRouterList = routerList?.reduce((arr, item) => arr.concat(deepFirstSearch(item)), []);
      commit('setUnfoldRouterList', unfoldRouterList);
      routerList?.forEach(item => {
        const route = {
          name: item?.children?.length > 0 ? item.url : '',
          path: '/' + item.url,
          component: Layout,
          children: getChildrenRoutes(item?.children?.length > 0 ? item.url : '', item),
        };
        route.redirect = route.children[0].path;
        routes.push(route);
      });
      return routes;
    },
  },
};
