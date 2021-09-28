/*
 * @Description  : 组件的自动化全局注册
 * @Author       : turbo
 * @Date         : 2021-02-08 14:08:13
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-25 18:10:26
 */

import Vue from 'vue';
import { lowerFirst, kebabCase } from 'lodash';

const prefix = 'global-';

const requireComponent = require.context(
  // 其组件目录的相对路径
  '.',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /[A-Z|a-z]\w+\.vue$/,
);

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName);

  // 获取组件的 kebabCase 命名
  const componentName = lowerFirst(
    kebabCase(
      // 获取和目录深度无关的文件名
      prefix +
        fileName
          .split('./')
          .pop()
          .replace(/\/index\.\w+$/, ''),
    ),
  );

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，那么就会优先使用 `.default`，否则回退到使用模块的根。
    componentConfig.default || componentConfig,
  );
});
