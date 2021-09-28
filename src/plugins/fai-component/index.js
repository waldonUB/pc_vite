/*
 * @Description  : 按需引入 fai-component 组件
 * @Author       : turbo
 * @Date         : 2021-01-28 12:30:23
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-03 17:35:21
 */

import './styles/form.scss';
import './styles/input.scss';
import './styles/checkbox.scss';
import './styles/radio.scss';
import './styles/tooltip.scss';
import './styles/select.scss';

import {
  Button,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  Form,
  FormModel,
  Icon,
  Input,
  Menu,
  Pagination,
  Popover,
  Radio,
  Row,
  Select,
  Steps,
  Tooltip,
  TreeSelect,
  Upload,
} from '@fk/faicomponent';

import Vue from 'vue';

// import './styles/select.scss';

// 自定义样式

// 自定义样式

// FaIcon
// const FaIcon = Icon.createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_1053694_8hdqoyr00ay.js',
// });

// Vue.component('adi-icon', FaIcon);
Vue.use(Form)
  .use(Input)
  .use(Button)
  .use(Checkbox)
  .use(Menu)
  .use(Pagination)
  .use(Radio)
  .use(Icon)
  .use(FormModel)
  .use(Select)
  .use(TreeSelect)
  .use(Cascader)
  .use(Tooltip)
  .use(Popover)
  .use(Steps)
  .use(Collapse)
  .use(Upload)
  .use(Row)
  .use(Col);

Vue.prototype.$form = Form;
