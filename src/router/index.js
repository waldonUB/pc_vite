/*
 * @Description  : 路由表
 * @Author       : turbo
 * @Date         : 2021-01-12 17:10:35
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-06 15:48:28
 */

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export const constantRoutes = [
  {
    path: '/',
    redirect: '/redirect',
  },
  {
    name: 'redirect',
    path: '/redirect/:path*',
    component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue'),
  },
];

const router = new VueRouter({
  routes: constantRoutes,
  scrollBehavior: () => ({ y: 0 }),
});

export default router;
