/*
 * @Description  : 按需引入 element-ui 组件
 * @Author       : turbo
 * @Date         : 2021-01-29 14:11:28
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-18 18:48:30
 */

import '@/styles/element-variables.scss';

import {
  Dialog,
  Icon,
  InfiniteScroll,
  Loading,
  Message,
  MessageBox,
  Scrollbar,
  Table,
  TableColumn,
  Tooltip,
  DatePicker,
  Popover,
  Checkbox,
} from 'element-ui';

const elementUIPlugins = {
  install(Vue) {
    Vue.prototype.$message = Message;
    Vue.use(Scrollbar)
      .use(Tooltip)
      .use(Dialog)
      .use(Icon)
      .use(Table)
      .use(TableColumn)
      .use(Loading.directive)
      .use(InfiniteScroll)
      .use(DatePicker)
      .use(Popover)
      .use(Checkbox);
    Vue.prototype.$confirm = MessageBox.confirm;
  },
};

export default elementUIPlugins;
